using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Unidesk.Controllers;
using Unidesk.Db;
using Unidesk.Db.Core;
using Unidesk.Db.Functions;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.Requests;
using Unidesk.Security;
using Unidesk.Server;
using Unidesk.Utils;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services;

public class UserService
{
    private readonly UnideskDbContext _db;

    public UserService(UnideskDbContext db)
    {
        _db = db;
    }

    public Task<List<User>> FindAsync(ILoginRequest request)
    {
        return _db.Users
           .Query()
           .Where(u => u.Email == request.Eppn).ToListAsync();
    }

    public Task<User?> FindAsync(Guid id)
    {
        return _db.Users
           .Query()
           .IgnoreQueryFilters()
           .FirstOrDefaultAsync(x => x.Id == id);
    }

    public IQueryable<User> Where(UserFilter? filter)
    {
        var query =
            filter?.IncludeHidden == true
                ? _db.Users.IgnoreQueryFilters().Where(i => States.ActiveOrHidden.Contains(i.State))
                : _db.Users.AsQueryable();

        if (filter == null)
        {
            return query;
        }

        if (filter.UserFunctions.Any())
        {
            var combinedFunctions = filter.UserFunctions.Combine();
            query = query.Where(x => (x.UserFunction & combinedFunctions) != 0);
        }

        if (filter.LinkedWithStag.HasValue)
        {
            query = filter.LinkedWithStag == true
                ? query.Where(x => x.StagId != null)
                : query.Where(x => x.StagId == null);
        }

        if (filter.Keyword.IsNotNullOrEmpty())
        {
            var keyword = filter.Keyword.Trim();
            var isGuid = Guid.TryParse(keyword, out var guid);
            if (isGuid)
            {
                query = query.Where(x => x.Id == guid);
            }
            else
            {
                if (keyword.Contains(' '))
                {
                    var parts = keyword.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length == 2)
                    {
                        var firstName = parts[0];
                        var lastName = parts[1];
                        query = query.Where(x => (x.FirstName == firstName && x.LastName == lastName) ||
                                                 (x.FirstName == lastName && x.LastName == firstName));
                    }
                }
                else
                {
                    query = query.Where(x =>
                        (x.Username != null && x.Username.Contains(keyword)) ||
                        (x.Email != null && x.Email.Contains(keyword)) ||
                        (x.LastName != null && (x.LastName.Contains(keyword) || SQL.Levenshtein(x.LastName, keyword, 1) <= 1)) ||
                        (x.FirstName != null && (x.FirstName.Contains(keyword) || SQL.Levenshtein(x.FirstName, keyword, 1) <= 1)) ||
                        (x.MiddleName != null && x.MiddleName.Contains(keyword))
                    );
                }
            }
        }

        return query;
    }

    public async Task GetUsersRatio(UserFunction userFunction = UserFunction.Supervisor, ThesisStatus thesisStatus = ThesisStatus.Finished_Susccessfully)
    {
        var teachers = await _db.ThesisUsers
           .Where(i => i.Function == userFunction)
           .Select(i => new { i.User, i.Thesis.Status })
           .ToListAsync();

        var grouped = teachers
           .GroupBy(i => i.User, (i, j) =>
            {
                var statuses = j
                   .Select(k => k.Status)
                   .ToList();

                return new { User = i, Ratio = statuses.Count(k => k == thesisStatus) / (double)statuses.Count(), Total = statuses.Count };
            })
           .Where(i => i.Total >= 10)
           .OrderByDescending(i => i.Ratio)
           .ToList();
    }

    public async Task<(double? Ratio, int? Total)> GetUserRatio(User user, UserFunction userFunction = UserFunction.Supervisor,
        ThesisStatus thesisStatus = ThesisStatus.Finished_Susccessfully)
    {
        var statuses = await _db.ThesisUsers
           .Where(i => i.Function == userFunction && i.UserId == user.Id)
           .Select(i => i.Thesis.Status)
           .ToListAsync();

        if (!statuses.Any())
        {
            return (null, null);
        }

        var total = statuses.Count;
        var ratio = statuses.Count(i => i == thesisStatus) / (double)total;

        return (ratio, total);
    }

    public IEnumerable<KeyValuePair<string, string>> GetUserClaimableProperties(User user)
    {
        yield return new KeyValuePair<string, string>(ClaimTypes.Name, user.Username ?? string.Empty);
        yield return new KeyValuePair<string, string>(ClaimTypes.NameIdentifier, user.Id.ToString());
        yield return new KeyValuePair<string, string>("Grants", string.Join(",", user.Roles.SelectMany(i => i.Grants.Select(j => j.Id))));
        yield return new KeyValuePair<string, string>("Created", $"{user.Created:O}");
    }

    public IEnumerable<Claim> GetClaims(User user)
    {
        var props = GetUserClaimableProperties(user).ToList();
        foreach (var property in props)
        {
            yield return new Claim(property.Key, property.Value);
        }

        yield return new Claim("Fingerprint", CryptographyUtils.Hash(props));
    }

    public bool IsPrincipalValid(ClaimsPrincipal? principal)
    {
        // no principal or no claims
        if (principal is null || !principal.Claims.Any())
        {
            return false;
        }

        var props = principal.Claims
           .ToList()
           .ToDictionary(i => i.Type, i => i.Value)
           .ToList();

        var fingerprint = principal.FindFirstValue("Fingerprint");

        var computedFingerprint = CryptographyUtils.Hash(props);
        return fingerprint == computedFingerprint;
    }

    public User FromClaims(ClaimsObject claims)
    {
        return new User
        {
            Id = claims.NameIdentifier,
            Username = claims.Name,
            Email = claims.Name.Contains("@")
                ? claims.Name
                : $"{claims.Name}@unidesk.tul",
            Roles = new List<UserRole>
            {
                new()
                {
                    Name = "Debug",
                    Grants = claims.Grants,
                },
            },
        };
    }

    public async Task SignInAsync(HttpContext httpContext, User dbUser)
    {
        var claims = GetClaims(dbUser);
        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
        var authProperties = new AuthenticationProperties();

        await httpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            claimsPrincipal,
            authProperties
        );
    }

    public User FromLoginRequest(ILoginRequest request)
    {
        var user = new User
        {
            Username = request.Eppn,
            Email = $"{request.Eppn}@unidesk.tul",
        };

        return user;
    }

    public async Task SignOutAsync(HttpContext httpContext)
    {
        await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        httpContext.Response.Cookies.Delete($".AspNetCore.{CookieAuthenticationDefaults.AuthenticationScheme}");
    }

    public async Task<User> CreateFromShibboRequestAsync(LoginShibboRequest shibboRequest)
    {
        var user = new User
        {
            Username = shibboRequest.Eppn.UsernameFromEmail(),
            Email = shibboRequest.Eppn.ValidEmailOrDefault(),
            FirstName = shibboRequest.Eppn.FirstnameFromEmail(),
            LastName = shibboRequest.Eppn.LastnameFromEmail(),
            MiddleName = null,
            Roles = new List<UserRole>(),
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return user;
    }

    public async Task<User> FixRolesAsync(User user)
    {
        if (user.Email == "admin@unidesk.tul.cz")
        {
            user.Roles = new List<UserRole>
            {
                new() { Name = "Admin", Grants = UserGrants.All.ToList() },
            };
            if (_db.Entry(user).State == EntityState.Modified)
            {
                await _db.SaveChangesAsync();
            }
        }

        return user;
    }
}
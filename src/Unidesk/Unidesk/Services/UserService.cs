using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Unidesk.Controllers;
using Unidesk.Db;
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

    public Task<User?> FindAsync(ILoginRequest request)
    {
        return _db.Users.FirstOrDefaultAsync(x => x.Username == request.Username);
    }

    public Task<User?> FindAsync(Guid id)
    {
        return _db.Users.FirstOrDefaultAsync(x => x.Id == id);
    }

    public Task<List<User>> FindAllAsync(UserFilter keyword)
    {
        return this
            .Where(keyword)
            .ToListAsync();
    }

    public IQueryable<User> Where(UserFilter? filter)
    {
        var query = _db.Users.AsQueryable();
        if (filter == null)
        {
            return query;
        }

        if (filter.UserFunctions.Any())
        {
            // combine list of enums bitwise
            var combinedFunctions = filter.UserFunctions.Aggregate((x, y) => x | y);
            query = query.Where(x => (x.UserFunction & combinedFunctions) != 0);
        }

        if (filter.Keyword.IsNotNullOrEmpty())
        {
            var keyword = filter.Keyword;
            var isGuid = Guid.TryParse(keyword, out var guid);
            if (isGuid)
            {
                query = query.Where(x => x.Id == guid);
            }
            else
            {
                query = query.Where(x =>
                    (isGuid && x.Id == guid) ||
                    (x.Username != null && x.Username.Contains(keyword)) ||
                    (x.Email != null && x.Email.Contains(keyword)) ||
                    (x.FirstName != null && x.FirstName.Contains(keyword)) ||
                    (x.LastName != null && x.LastName.Contains(keyword)) ||
                    (x.MiddleName != null && x.MiddleName.Contains(keyword))
                );
            }
        }

        return query;
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
                new UserRole
                {
                    Name = "Debug",
                    Grants = claims.Grants
                }
            }
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
            Username = request.Username,
            Email = $"{request.Username}@unidesk.tul",
        };

        if (request.Username.Contains("admin"))
        {
            user.Roles = new List<UserRole>
            {
                new UserRole { Name = "Admin", Grants = UserGrants.All.ToList() }
            };
        }

        return user;
    }

    public async Task SignOutAsync(HttpContext httpContext)
    {
        await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    }
}
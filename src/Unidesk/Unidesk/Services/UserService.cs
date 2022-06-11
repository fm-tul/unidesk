using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Unidesk.Controllers;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Server;
using Unidesk.Utils;

namespace Unidesk.Services;

public class UserService
{
    private readonly UnideskDbContext _db;

    public UserService(UnideskDbContext db)
    {
        _db = db;
    }
    
    public Task<User?> FindUserAsync(ILoginRequest request)
    {
        return _db.Users.FirstOrDefaultAsync(x => x.Username == request.Username);
    }
    
    public Task<User?> FindUserAsync(Guid id)
    {
        return _db.Users.FirstOrDefaultAsync(x => x.Id == id);
    }
    
    public IEnumerable<Claim> GetClaims(User user)
    {
        yield return new Claim(ClaimTypes.Name, user.Username);
        yield return new Claim(ClaimTypes.NameIdentifier, user.Id.ToString());
        yield return new Claim("Created", $"{user.Created:O}");
        yield return new Claim("Fingerprint", CryptographyUtils.Hash(user));
    }

    public bool IsPrincipalValid(ClaimsPrincipal? principal)
    {
        // no principal or no claims
        if (principal is null || !principal.Claims.Any())
        {
            return false;
        }
            
        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var created = principal.FindFirstValue("Created");
        var fingerprint = principal.FindFirstValue("Fingerprint");
        
        var computedFingerprint = CryptographyUtils.Hash(userId, created);
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
        return new User
        {
            Username = request.Username,
            Email = $"{request.Username}@unidesk.tul",
        };
    }
}
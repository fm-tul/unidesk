using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Unidesk.Controllers;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Utils;

namespace Unidesk.Services;

public class LoginService
{
    private readonly UnideskDbContext _db;

    public LoginService(UnideskDbContext db)
    {
        _db = db;
    }
    
    public Task<User?> FindUserAsync(LoginRequest request)
    {
        return _db.Users.FirstOrDefaultAsync(x => x.Username == request.Username);
    }
    
    public IEnumerable<Claim> GetClaims(User user)
    {
        yield return new Claim(ClaimTypes.Name, user.Username);
        yield return new Claim(ClaimTypes.NameIdentifier, user.Id.ToString());
        yield return new Claim("Created", $"{user.Created:O}");
        yield return new Claim("Fingerprint", CryptographyUtils.Hash(user));
    }

    public bool CompareFingerprints(ClaimsPrincipal principal)
    {
        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var created = principal.FindFirstValue("Created");
        var fingerprint = principal.FindFirstValue("Fingerprint");
        
        var computedFingerprint = CryptographyUtils.Hash(userId, created);
        return fingerprint == computedFingerprint;
    }
    
    public User? FromPrincipal(ClaimsPrincipal principal)
    {
        if(!CompareFingerprints(principal))
        {
            return null;
        }
        
        var userId = Guid.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier));
        return _db.Users.FirstOrDefault(i => i.Id == userId);
    }
}
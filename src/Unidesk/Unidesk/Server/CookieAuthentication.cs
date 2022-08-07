using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Unidesk.Configurations;
using Unidesk.Db.Models;
using Unidesk.Security;
using Unidesk.Services;
using Unidesk.Utils;

namespace Unidesk.Server;

public static class CookieAuthentication
{
    public static async Task OnValidatePrincipal(CookieValidatePrincipalContext context)
    {
        var serviceProvider = context.HttpContext.RequestServices;
        var userProvider = serviceProvider.GetService<IUserProvider>()!;
        var userService = serviceProvider.GetService<UserService>()!;
        var options = serviceProvider.GetService<AppOptions>()!;
        var principal = context.Principal;

        // ignore if user is invalid principal
        if (principal is null || !userService.IsPrincipalValid(principal))
        {
            userProvider.CurrentUser = null;
            context.RejectPrincipal();
            return;
        }
        
        // try to get a user from the cookies
        var claims = ClaimsObject.Create(principal);
        var user = await userService.FindUserAsync(claims.NameIdentifier);

        // user is found? goood 🤖
        if (user is not null)
        {
            userProvider.CurrentUser = user;
            return;
        }
        
        // we allow users which are not yet in the db only if settings allow it
        if (options.AllowLocalAccounts)
        {
            userProvider.CurrentUser = userService.FromClaims(claims);
            return;
        }
        
        // reject the user
        userProvider.CurrentUser = null;
        context.RejectPrincipal();
    }
}

public class ClaimsObject
{
    public string Name { get; init; }
    public Guid NameIdentifier { get; init; }
    public DateTime Created { get; init; }
    public string Fingerprint { get; init; }
    public ClaimsPrincipal _principal { get; init; }
    
    public List<Grant> Grants { get; init; }
    
    public List<KeyValuePair<string, string>> Claims => _principal.Claims
        .Select(c => new KeyValuePair<string, string>(c.Type, c.Value))
        .ToList();

    public bool IsValid => CryptographyUtils.Hash(Claims) == Fingerprint;  
    
    public static ClaimsObject Create(ClaimsPrincipal principal)
    {
        var allGrants = UserGrants.All.ToList();
        return new ClaimsObject
        {
            _principal = principal,
            Name = principal.FindFirstValue(ClaimTypes.Name),
            NameIdentifier = Guid.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)),
            Created = DateTime.Parse(principal.FindFirstValue("Created")),
            Grants = principal.FindFirstValue("Grants")
                .Split(',')
                .Where(i => !string.IsNullOrWhiteSpace(i))
                .Select(i => Guid.Parse(i))
                .Select(i => allGrants.FirstOrDefault(g => g.Id == i))
                .Where(i => i is not null)
                .OfType<Grant>()
                .ToList(),
            Fingerprint = principal.FindFirstValue("Fingerprint"),
        };
    }

}
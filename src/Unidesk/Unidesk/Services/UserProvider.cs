using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Unidesk.Db;
using Unidesk.Db.Models;

namespace Unidesk.Services;

public class UserProvider : IUserProvider
{
    public User? GetUserFromCookie(CookieValidatePrincipalContext context, LoginService _loginService)
    {
        var principal = context.Principal;
        if (principal == null)
        {
            return null;
        }

        return _loginService.FromPrincipal(principal);
    }

    public User CurrentUser { get; set; } = null!;
}
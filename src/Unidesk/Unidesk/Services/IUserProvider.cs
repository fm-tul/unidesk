using Microsoft.AspNetCore.Authentication.Cookies;
using Unidesk.Db.Models;

namespace Unidesk.Services;

public interface IUserProvider
{
    public User? GetUserFromCookie(CookieValidatePrincipalContext context, LoginService _loginService);
    public User CurrentUser { get; set; }
}
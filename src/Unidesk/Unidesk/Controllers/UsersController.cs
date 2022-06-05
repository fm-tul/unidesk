using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Unidesk.Db;
using Unidesk.Services;
using Unidesk.Utils;

namespace Unidesk.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly LoginService _loginService;

    public UsersController(ILogger<UsersController> logger, IHttpContextAccessor httpContextAccessor, LoginService loginService)
    {
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
        _loginService = loginService;
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var httpContext = _httpContextAccessor.HttpContext
                          ?? throw new ArgumentNullException(nameof(_httpContextAccessor));

        var dbUser = await _loginService.FindUserAsync(request)
                     ?? Db.Models.User.Guest;
                     // ?? throw new UnauthorizedAccessException("Invalid username or password");
        
        var claims = _loginService.GetClaims(dbUser);
        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
        var authProperties = new AuthenticationProperties();

        await httpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            claimsPrincipal,
            authProperties
        );

        _logger.LogInformation("User {Email} logged in at {Time}", request.Username, DateTime.UtcNow);

        return Ok(new LoginResponse
        {
            IsAuthenticated = true,
            Message = "User logged in successfully",
        });
    }

    [HttpGet]
    [Authorize]
    [Route("test")]
    public async Task<IActionResult> Test()
    {
        var user = HttpContext.User;
        return Ok();
    }
}

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

public class LoginResponse
{
    public bool IsAuthenticated { get; set; }
    public string Message { get; set; }
}
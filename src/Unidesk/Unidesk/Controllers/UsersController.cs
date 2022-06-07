using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Unidesk.Configurations;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Services;
using Unidesk.Utils;

namespace Unidesk.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly UserService _userService;
    private readonly CryptographyUtils _cryptography;
    private readonly IUserProvider _userProvider;
    private readonly AppOptions _appOptions;

    public UsersController(ILogger<UsersController> logger, IHttpContextAccessor httpContextAccessor, UserService userService, CryptographyUtils cryptography, IUserProvider userProvider, AppOptions appOptions)
    {
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
        _userService = userService;
        _cryptography = cryptography;
        _userProvider = userProvider;
        _appOptions = appOptions;
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        if (!_appOptions.AllowLocalAccounts)
        {
            return Forbid();
        }

        var httpContext = _httpContextAccessor.HttpContext
                          ?? throw new ArgumentNullException(nameof(_httpContextAccessor));

        var dbUser = _userService.FromLoginRequest(request);
        await _userService.SignInAsync(httpContext, dbUser);
        _logger.LogInformation("User {Email} logged in at {Time}", request.Username, DateTime.UtcNow);

        return Ok(new LoginResponse
        {
            IsAuthenticated = true,
            Message = "User logged in successfully",
        });
    }

    [HttpGet]
    [Route("login.sso/{*path}")]
    public async Task<IActionResult> LoginSSO(string path)
    {
        var plainText = _cryptography.DecryptText(path);
        var httpContext = _httpContextAccessor.HttpContext
                          ?? throw new ArgumentNullException(nameof(_httpContextAccessor));
        
        var shibboRequest = JsonSerializer.Deserialize<LoginShibboRequest>(plainText)
            ?? throw new ArgumentNullException(nameof(plainText));

        if (string.IsNullOrEmpty(shibboRequest.Username))
        {
            return BadRequest();
        }

        var dbUser = await _userService.FindUserAsync(shibboRequest);
        if (dbUser is null)
        {
            if (_appOptions.AllowLocalAccounts)
            {
                dbUser = _userService.FromLoginRequest(shibboRequest);
            }
            else
            {
                return Forbid();
            }
        }
                     
        await _userService.SignInAsync(httpContext, dbUser);
        _logger.LogInformation("User {Email} logged in at {Time}", shibboRequest.Username, DateTime.UtcNow);

        return Ok(new LoginResponse
        {
            IsAuthenticated = true,
            Message = $"User {dbUser.Username} logged in successfully",
        });
    }

    [HttpGet]
    [Authorize]
    [Route("test")]
    public async Task<IActionResult> Test()
    {
        return Ok(new LoginResponse
        {
            Message = $"User {_userProvider.CurrentUser.Username} is authenticated",
            IsAuthenticated = true,
        });
    }
}
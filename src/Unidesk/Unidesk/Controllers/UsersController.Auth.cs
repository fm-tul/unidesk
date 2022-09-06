using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Dtos;

namespace Unidesk.Controllers;

public partial class UsersController
{
    [HttpPost, Route("login")]
    [SwaggerOperation(OperationId = nameof(Login))]
    [ProducesResponseType(typeof(LoginResponse), 200)]
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
            User = _mapper.Map<UserDto>(dbUser)
        });
    }

    [HttpGet, Route("login.sso/{*path}")]
    [SwaggerOperation(OperationId = nameof(LoginSSO))]
    [ProducesResponseType(typeof(LoginResponse), 200)]
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

        var dbUser = await _userService.FindAsync(shibboRequest);
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
            User = _mapper.Map<UserDto>(dbUser)
        });
    }

    [HttpGet, Route("logout")]
    [SwaggerOperation(OperationId = nameof(Logout))]
    [ProducesResponseType(typeof(LoginResponse), 200)]
    public async Task<IActionResult> Logout()
    {
        var user = _userProvider.CurrentUser ?? throw new ArgumentNullException(nameof(_userProvider.CurrentUser));

        var httpContext = _httpContextAccessor.HttpContext
                          ?? throw new ArgumentNullException(nameof(_httpContextAccessor));
        await _userService.SignOutAsync(httpContext);
        _logger.LogInformation("User {Email} logged out at {Time}", user.Email, DateTime.UtcNow);

        return Ok(new LoginResponse
        {
            IsAuthenticated = false,
            Message = "User logged out successfully"
        });
    }
}
﻿using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Utils.Extensions;

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
        _logger.LogInformation("User {Email} logged in at {Time}", request.Eppn, DateTime.UtcNow);

        return Ok(new LoginResponse
        {
            IsAuthenticated = true,
            Message = "User logged in successfully",
            User = _mapper.Map<UserDto>(dbUser)
        });
    }

    [HttpGet, Route("/login.sso/{*path}")]
    [SwaggerOperation(OperationId = nameof(LoginSSO))]
    [ProducesResponseType(typeof(LoginResponse), 200)]
    public async Task<IActionResult> LoginSSO(string path)
    {
        var plainText = _cryptography.DecryptText(path);
        var httpContext = _httpContextAccessor.HttpContext
                       ?? throw new ArgumentNullException(nameof(_httpContextAccessor));

        var shibboRequest = JsonSerializer.Deserialize<LoginShibboRequest>(plainText)
                         ?? throw new ArgumentNullException(nameof(plainText));

        if (string.IsNullOrEmpty(shibboRequest.Eppn))
        {
            return BadRequest();
        }

        var candidates = await _userService.FindAsync(shibboRequest);
        User? dbUser = null;
        await candidates.HandleCountAsync(
            singleItem => Task.FromResult(dbUser = singleItem),
            _ => throw new ArgumentException("Multiple users found with the same email! Email: {Email}", shibboRequest.Eppn),
            async () =>
            {
                if (_appOptions.AllowRegistrations)
                {
                    dbUser = await _userService.CreateFromShibboRequestAsync(shibboRequest);
                }
                else if (_appOptions.AllowLocalAccounts)
                {
                    dbUser = _userService.FromLoginRequest(shibboRequest);
                }
            }
        );

        if (dbUser == null)
        {
            return Forbid();
        }

        await _userService.SignInAsync(httpContext, dbUser);
        _logger.LogInformation("User {Email} logged in at {Time}", shibboRequest.Eppn, DateTime.UtcNow);

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
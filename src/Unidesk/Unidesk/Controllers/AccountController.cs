﻿using System.Diagnostics.CodeAnalysis;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Configurations;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Services;
using Unidesk.Utils;
using System.Text.Json;
using Unidesk.Utils.Extensions;
using BCrypt.Net;
using Unidesk.Db.Core;
using Unidesk.Exceptions;
using Unidesk.Security;
using Unidesk.ServiceFilters;

namespace Unidesk.Controllers;

[ApiController]
[Authorize]
[Route("/api/[controller]")]
[ExcludeFromCodeCoverage]
public class AccountController : ControllerBase
{
    private readonly ILogger<AccountController> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly UserService _userService;
    private readonly CryptographyUtils _cryptography;
    private readonly IUserProvider _userProvider;
    private readonly AppOptions _appOptions;
    private readonly IMapper _mapper;

    public AccountController(ILogger<AccountController> logger, IHttpContextAccessor httpContextAccessor, UserService userService, CryptographyUtils cryptography, IUserProvider userProvider,
        AppOptions appOptions, IMapper mapper)
    {
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
        _userService = userService;
        _cryptography = cryptography;
        _userProvider = userProvider;
        _appOptions = appOptions;
        _mapper = mapper;
    }

    // redirects to SAML service provider
    [HttpGet, Route("/liane-login")]
    [AllowAnonymous]
    [SwaggerOperation(OperationId = nameof(LianeLogin))]
    public RedirectResult LianeLogin()
    {
        var loginUrl = _appOptions.LianeLoginUrl;
        return Redirect(loginUrl);
    }


    [HttpPost, Route("login")]
    [AllowAnonymous]
    [SwaggerOperation(OperationId = nameof(Login))]
    [ProducesResponseType(typeof(ToastResponse<UserWhoamiDto>), 200)]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken ct)
    {
        var httpContext = _httpContextAccessor.HttpContext
                       ?? throw new ArgumentNullException(nameof(_httpContextAccessor));

        var dbUser = await _userService.FromLoginRequestAsync(request, ct)
                  ?? throw new Exception("User not found or password is incorrect");

        await _userService.FixRolesAsync(dbUser, ct);
        await _userService.SignInAsync(httpContext, dbUser);
        _logger.LogInformation("User {Email} logged in at {Time}", request.Eppn, DateTime.UtcNow);

        var dto = _mapper.Map<UserWhoamiDto>(dbUser);
        dto.Environment = _appOptions.Environment;

        return Ok(new ToastResponse<UserWhoamiDto>
        {
            Message = "User logged in successfully",
            Data = dto,
        });
    }
    
    [HttpPost, Route("register")]
    [RequireGrant(Grants.Action_Create_User)]
    [SwaggerOperation(OperationId = nameof(Register))]
    [ProducesResponseType(typeof(ToastResponse<bool>), 200)]
    public async Task<IActionResult> Register(RegisterRequest request, CancellationToken ct)
    {
        var dbUser = await _userService.RegisterFromRequestAsync(request, ct, usePassword: false)
                  ?? throw new Exception("User not found");

        return Ok(new ToastResponse<bool>
        {
            Message = $"User {dbUser.Email} registered successfully",
            Data = true,
        });
        // await _userService.SignInAsync(httpContext, dbUser);
        // _logger.LogInformation("User {Email} logged in at {Time}", request.Eppn, DateTime.UtcNow);
        //
        // var dto = _mapper.Map<UserWhoamiDto>(dbUser);
        // dto.Environment = _appOptions.Environment;
        //
        // return Ok(new ToastResponse<UserWhoamiDto>
        // {
        //     Message = "User logged in successfully",
        //     Data = dto,
        // });
    }
    
    [HttpPost, Route("reset-password")]
    [AllowAnonymous]
    [SwaggerOperation(OperationId = nameof(ResetPassword))]
    [ProducesResponseType(typeof(ToastResponse<UserWhoamiDto>), 200)]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request, CancellationToken ct)
    {
        await _userService.RequestResetPasswordAsync(request, ct);
        return Ok();
    }

    [HttpGet, Route("whoami")]
    [SwaggerOperation(OperationId = nameof(WhoAmI))]
    [ProducesResponseType(typeof(ToastResponse<UserWhoamiDto>), 200)]
    public IActionResult WhoAmI()
    {
        var user = _userProvider.CurrentUser;
        var dto = _mapper.Map<UserWhoamiDto>(user);
        dto.Environment = _appOptions.Environment;
        return Ok(new ToastResponse<UserWhoamiDto>
        {
            Data = dto,
        });
    }

    [HttpGet, Route("login.sso/{*path}")]
    [AllowAnonymous]
    [SwaggerOperation(OperationId = nameof(LoginSSO))]
    [ProducesResponseType(typeof(ToastResponse<UserWhoamiDto>), 200)]
    public async Task<IActionResult> LoginSSO(string path, CancellationToken ct)
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

        var candidates = await _userService.FindAsync(shibboRequest, includeNotActive: true);
        User? dbUser = null;
        await candidates.HandleCountAsync(
            singleItem =>
            {
                if (singleItem.State == StateEntity.Blocked)
                {
                    throw new NotAllowedException("You don't have access to this application");
                }
                return Task.FromResult(dbUser = singleItem);
            },
            _ => throw new ArgumentException("Multiple users found with the same email! Email: {Email}", shibboRequest.Eppn),
            async () =>
            {
                if (_appOptions.AllowRegistrations)
                {
                    dbUser = await _userService.CreateFromShibboRequestAsync(shibboRequest);
                }
                else if (_appOptions.AllowLocalAccounts)
                {
                    dbUser = _userService.GetFromShibboLoginRequest(shibboRequest);
                }
            }
        );

        if (dbUser == null)
        {
            return Forbid();
        }

        await _userService.FixRolesAsync(dbUser, ct);
        await _userService.SignInAsync(httpContext, dbUser);
        _logger.LogInformation("User {Email} logged in at {Time}", shibboRequest.Eppn, DateTime.UtcNow);

        var dto = _mapper.Map<UserWhoamiDto>(dbUser);
        dto.Environment = _appOptions.Environment;
        if (_appOptions.Environment is EnvironmentType.Local)
        {
            return Ok(new ToastResponse<UserDto>
            {
                Message = $"User {dbUser.Username} logged in successfully",
                Data = dto,
            });
        }

        return Redirect("/");
    }

    [HttpGet, Route("logout")]
    [AllowAnonymous]
    [SwaggerOperation(OperationId = nameof(Logout))]
    [ProducesResponseType(typeof(ToastResponse<UserDto?>), 200)]
    public async Task<IActionResult> Logout()
    {
        var user = (User?)_userProvider.CurrentUser;
        var httpContext = _httpContextAccessor.HttpContext
                       ?? throw new ArgumentNullException(nameof(_httpContextAccessor));

        await _userService.SignOutAsync(httpContext);
        _logger.LogInformation("User {Email} logged out at {Time}", user?.Email, DateTime.UtcNow);


        return Ok(new ToastResponse<UserDto?>
        {
            Message = "User logged out successfully",
            Data = null,
        });
    }
}
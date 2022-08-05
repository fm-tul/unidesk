using System.Text.Json;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Configurations;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.Requests;
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
    private readonly IMapper _mapper;
    private readonly UnideskDbContext _db;

    public UsersController(ILogger<UsersController> logger, IHttpContextAccessor httpContextAccessor, UserService userService, CryptographyUtils cryptography, IUserProvider userProvider, AppOptions appOptions, IMapper mapper, UnideskDbContext db)
    {
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
        _userService = userService;
        _cryptography = cryptography;
        _userProvider = userProvider;
        _appOptions = appOptions;
        _mapper = mapper;
        _db = db;
    }

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

    [HttpGet, Authorize, Route("test")]
    [SwaggerOperation(OperationId = nameof(Test))]
    [ProducesResponseType(typeof(LoginResponse), 200)]
    public async Task<IActionResult> Test()
    {
        return Ok(new LoginResponse
        {
            Message = $"User {_userProvider.CurrentUser!.Username} is authenticated",
            IsAuthenticated = true,
        });
    }

    [HttpGet, Route("get/{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var user = await _userService.FindUserAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<UserDto>(user));
    }
    
    [HttpGet, Route("all")]
    [SwaggerOperation(OperationId = nameof(GetAll))]
    [ProducesResponseType(typeof(List<UserDto>), 200)]
    public async Task<IActionResult> GetAll([FromQuery] PagedQuery? query = null)
    {
        var users = await _db.Users
            .OrderBy(i => i.LastName)
            .ApplyPaging(query)
            .ToListAsync();
        
        var usersDto = _mapper.Map<List<UserDto>>(users);
        return Ok(_mapper.Map<List<UserDto>>(usersDto));
    }
}
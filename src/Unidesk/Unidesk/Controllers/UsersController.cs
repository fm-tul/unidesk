using System.Diagnostics.CodeAnalysis;
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
[ExcludeFromCodeCoverage]
public partial class UsersController : ControllerBase
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


    [HttpGet, Route("get/{id}")]
    [SwaggerOperation(OperationId = nameof(Get))]
    [ProducesResponseType(typeof(UserDto), 200)]
    public async Task<IActionResult> Get(Guid id)
    {
        var user = await _userService.FindAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        var dto = _mapper.Map<UserDto>(user);
        if ((user.UserFunction & UserFunction.Supervisor) > 0)
        {
            (dto.SupervisionsRatio, dto.SupervisionsTotal) = await _userService.GetUserRatio(user);
        }

        return Ok(dto);
    }
    
    [HttpPost, Route("find")]
    [SwaggerOperation(OperationId = nameof(Find))]
    [ProducesResponseType(typeof(PagedResponse<UserDto>), 200)]
    public async Task<IActionResult> Find([FromBody] UserFilter? query = null)
    {
        var response = await _userService
            .Where(query)
            .Include(i => i.Theses)
            .OrderByDescending(i => i.Theses.Count)
            .ToListWithPagingAsync<User, UserDto>(query?.Filter, _mapper);

        return Ok(response);
    }
    
    [HttpGet, Route("the-best-teachers")]
    [SwaggerOperation(OperationId = nameof(GetTheBestTeachers))]
    [ProducesResponseType(typeof(List<UserDto>), 200)]
    public async Task<IActionResult> GetTheBestTeachers()
    {
        var teachers = _db.ThesisUsers
            .Where(i => i.Function == UserFunction.Supervisor)
            .Select(i => new { i.User, i.Thesis.Status })
            .ToList();

        var grouped = teachers
            .GroupBy(i => i.User, (i, j) =>
            {
                var statuses = j
                    .Select(k => k.Status)
                    .ToList();
                
                return new { User = i, Ratio = statuses.Count(k => k == ThesisStatus.Finished_Susccessfully) / (double)statuses.Count(), Total = statuses.Count };
            })
            .Where(i => i.Total >= 10)
            .OrderByDescending(i => i.Ratio)
            .ToList();
        
        return Ok();
    }
}
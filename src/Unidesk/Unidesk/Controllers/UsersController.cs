using System.Diagnostics.CodeAnalysis;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Configurations;
using Unidesk.Db;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.ReadOnly;
using Unidesk.Dtos.Requests;
using Unidesk.Security;
using Unidesk.Services;
using Unidesk.Utils;
using Unidesk.Utils.Extensions;

namespace Unidesk.Controllers;

[ApiController]
[Authorize]
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


    [HttpGet, Route("get/{id:guid}")]
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
        var aliases = user.Aliases.Select(i => i.Id).Concat(new[] { user.Id }).ToList();
        var aliasThesis = _db.ThesisUsers
           .Include(i => i.Thesis)
           .Where(i => aliases.Contains(i.UserId))
           .ToList();
        
        dto.AllThesis = _mapper.Map<List<ThesisSimpleWithUserDto>>(aliasThesis);
        
        return Ok(dto);
    }
    
    [HttpPost, Route("update")]
    [SwaggerOperation(OperationId = nameof(Update))]
    [ProducesResponseType(typeof(UserDto), 200)]
    public async Task<IActionResult> Update([FromBody] UserDto userDto)
    {
        var user = await _userService.FindAsync(userDto.Id)
            ?? throw new Exception("User not found");

        var canUpdate = _userProvider.CurrentUser.Id == user.Id
                     || _userProvider.HasSomeOfGrants(Grants.User_Admin, Grants.User_SuperAdmin);

        if (!canUpdate)
        {
            return Forbid();
        }

        
        user = _mapper.Map(userDto, user);
        
        var userInTeams = userDto.Teams
           .Select(i => UserInTeam.Convert(user.Id, i.Team.Id, i.Status, i.Role))
           .ToList();
        
        if (_userProvider.HasSomeOfGrants(Grants.User_Admin, Grants.User_SuperAdmin, Grants.Action_ManageRolesAndGrants))
        {
            var userRolesId = userDto.Roles.Select(i => i.Id).Distinct().ToList();
            var userRoles = _db.UserRoles.Where(i => userRolesId.Contains(i.Id)).ToList();
            user.Roles.SynchronizeCollection(userRoles);
        }
        
        user.UserInTeams.SynchronizeCollection(userInTeams, UserInTeam.Compare);
        // _db.Users.Update(user);

        var userAliases = _mapper.Map<List<User>>(userDto.Aliases)
           .Where(i => i.Id != user.Id)
           .Select(i => i.Id);
        
        var userAliasesFromDb = _db.Users.IgnoreQueryFilters().Where(i => userAliases.Contains(i.Id)).ToList();
        var (_, addedAliases, removedAliases) = user.Aliases.SynchronizeCollection(userAliasesFromDb, Unidesk.Db.Models.User.Compare);
        addedAliases.ForEach(i => i.State = StateEntity.Hidden);
        removedAliases.Where(i => i.State == StateEntity.Hidden).ForEach(i => i.State = StateEntity.Active).ToList();
        
        var props = _db.ModifiedPropertiesFor(user).ToList();
        await _db.SaveChangesAsync();

        var dto = _mapper.Map<UserDto>((await _userService.FindAsync(userDto.Id))!);
        return Ok(dto);
    }

    [HttpPost, Route("find")]
    [SwaggerOperation(OperationId = nameof(Find))]
    [ProducesResponseType(typeof(PagedResponse<UserLookupDto>), 200)]
    public async Task<IActionResult> Find([FromBody] UserFilter? query = null)
    {
        var response = await _userService
            .Where(query)
            .ApplyOrderBy(query?.Filter)
            .ToListWithPagingAsync<User, UserLookupDto>(query?.Filter, _mapper);
    
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
    
    [HttpDelete, Route("delete/{id:guid}")]
    [SwaggerOperation(OperationId = nameof(DeleteOne))]
    public async Task<IActionResult> DeleteOne(Guid id)
    {
        var user = await _userService.FindAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        if (!_userProvider.HasSomeOfGrants(Grants.User_Admin, Grants.User_SuperAdmin))
        {
            return Forbid();
        }

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();

        return Ok();
    }
}
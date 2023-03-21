using System.Diagnostics.CodeAnalysis;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.Requests;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services;

namespace Unidesk.Controllers;

[ApiController]
[Authorize]
[Route("/api/[controller]")]
[ExcludeFromCodeCoverage]
public class TeamController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly TeamService _teamService;
    private readonly UnideskDbContext _db;
    private readonly IUserProvider _userProvider;

    public TeamController(TeamService teamService, IMapper mapper, UnideskDbContext db, IUserProvider userProvider)
    {
        _teamService = teamService;
        _mapper = mapper;
        _db = db;
        _userProvider = userProvider;
    }


    [HttpPost, Route("find")]
    [SwaggerOperation(OperationId = nameof(Find))]
    [ProducesResponseType(typeof(PagedResponse<TeamDto>), 200)]
    public async Task<IActionResult> Find([FromBody] TeamFilter filter)
    {
        var query = _teamService.WhereFilter(filter);
        var response = await query
           .OrderBy(i => i.Name)
           .ToListWithPagingAsync<Team, TeamDto>(filter.Paging, _mapper);

        return Ok(response);
    }
    
    [HttpPost, Route("find-simple")]
    [SwaggerOperation(OperationId = nameof(FindSimple))]
    [ProducesResponseType(typeof(PagedResponse<TeamLookupDto>), 200)]
    public async Task<IActionResult> FindSimple([FromBody] TeamFilter filter)
    {
        var query = _teamService.WhereFilter(filter);
        var response = await query
           .OrderBy(i => i.Name)
           .ToListWithPagingAsync<Team, TeamLookupDto>(filter.Paging, _mapper);

        return Ok(response);
    }
    
    [HttpGet, Route("get/{id:guid}")]
    [SwaggerOperation(OperationId = nameof(Get))]
    [ProducesResponseType(typeof(TeamDto), 200)]
    public async Task<IActionResult> Get(Guid id)
    {
        var team = await _teamService.GetOneAsync(id);
        if (team == null)
        {
            return NotFound();
        }

        var dto = _teamService.ToDto(team);
        return Ok(dto);
    }

    [HttpPost, Route("upsert")]
    [SwaggerOperation(OperationId = nameof(Upsert))]
    [ProducesResponseType(typeof(TeamDto), 200)]
    [ProducesResponseType(typeof(SimpleJsonResponse), 500)]
    [RequireGrant(Grants.Entity_Team_Edit)]
    public async Task<IActionResult> Upsert([FromBody] TeamDto dto)
    {
        TeamDto.ValidateAndThrow(dto);
        
        var team = await _teamService.UpsertAsync(dto);
        var newDto = _teamService.ToDto(team);
        return Ok(newDto);
    }
    
    [HttpGet, Route("change-status")]
    [SwaggerOperation(OperationId = nameof(ChangeStatus))]
    [ProducesResponseType(typeof(SimpleJsonResponse), 200)]
    [ProducesResponseType(typeof(SimpleJsonResponse), 500)]
    public async Task<IActionResult> ChangeStatus(Guid userId, Guid teamId, UserInTeamStatus status)
    {
        var userInTeam = await _teamService.GetOneUserInTeamAsync(teamId, userId)
            ?? throw new Exception("User not found in team");
        
        // check access
        if (!_userProvider.CurrentUser.HasGrant(Grants.Entity_Team_Edit) && userInTeam.UserId != _userProvider.CurrentUser.Id)
        {
            return Forbid();
        }

        await _teamService.ChangeStatus(userInTeam, status);
        return Ok(new SimpleJsonResponse());
    }
    
    [HttpDelete, Route("delete")]
    [SwaggerOperation(OperationId = nameof(DeleteOne))]
    [ProducesResponseType(typeof(SimpleJsonResponse), 200)]
    [ProducesResponseType(typeof(SimpleJsonResponse), 500)]
    public async Task<IActionResult> DeleteOne(Guid id)
    {
        var team = await _teamService.GetOneAsync(id);
        if (team == null)
        {
            return NotFound();
        }
        
        // check access
        var owner = team.UserInTeams.FirstOrDefault(i => i.Role == TeamRole.Owner);
        var hasAccess = _userProvider.HasSomeOfGrants(Grants.User_Admin, Grants.User_SuperAdmin);
        hasAccess |= _userProvider.HasGrant(Grants.Entity_Team_Edit) && owner?.UserId == _userProvider.CurrentUser.Id;
        if (!hasAccess)
        {
            return Forbid();
        }

        await _teamService.DeleteAsync(team);
        return Ok(new SimpleJsonResponse());
    }
}
using System.Diagnostics.CodeAnalysis;
using AutoMapper;
using FluentValidation;
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
[Route("api/[controller]")]
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
           .ToListWithPagingAsync<Team, TeamDto>(filter.Filter, _mapper);

        return Ok(response);
    }
    
    [HttpGet, Route("get-one")]
    [SwaggerOperation(OperationId = nameof(GetOne))]
    [ProducesResponseType(typeof(TeamDto), 200)]
    public async Task<IActionResult> GetOne(Guid id)
    {
        var team = await _teamService.GetOneAsync(id);
        if (team == null)
        {
            return NotFound();
        }

        var dto = _mapper.Map<TeamDto>(team);
        return Ok(dto);
    }

    [HttpPost, Route("upsert")]
    [SwaggerOperation(OperationId = nameof(Upsert))]
    [ProducesResponseType(typeof(TeamDto), 200)]
    [ProducesResponseType(typeof(SimpleJsonResponse), 500)]
    [RequireGrant(UserGrants.Entity_Team_Edit_Id)]
    public async Task<IActionResult> Upsert([FromBody] TeamDto dto)
    {
        dto.ValidateAndThrow(dto);
        
        var result = await _teamService.UpsertAsync(dto);
        var newDto = _mapper.Map<TeamDto>(result);
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
        if (!_userProvider.CurrentUser.HasGrant(UserGrants.Entity_Team_Edit_Id) && userInTeam.UserId != _userProvider.CurrentUser.Id)
        {
            return Forbid();
        } 

        userInTeam.Status = status;
        await _db.SaveChangesAsync();
        return Ok(new SimpleJsonResponse());
    }
    
}
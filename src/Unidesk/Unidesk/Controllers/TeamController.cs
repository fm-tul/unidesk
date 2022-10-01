using System.Diagnostics.CodeAnalysis;
using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.Requests;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services;
using Unidesk.Utils.Extensions;

namespace Unidesk.Controllers;

[ApiController]
[Route("api/[controller]")]
[ExcludeFromCodeCoverage]
public class TeamController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly TeamService _teamService;
    private readonly UnideskDbContext _db;

    public TeamController(TeamService teamService, IMapper mapper, UnideskDbContext db)
    {
        _teamService = teamService;
        _mapper = mapper;
        _db = db;
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
        await TeamDto.GetValidator().ValidateAndThrowAsync(dto);
        
        var result = await _teamService.UpsertAsync(dto);
        var newDto = _mapper.Map<TeamDto>(result);
        return Ok(newDto);
    }
}
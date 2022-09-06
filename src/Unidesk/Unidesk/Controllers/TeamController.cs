using System.Diagnostics.CodeAnalysis;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Dtos;
using Unidesk.Services;

namespace Unidesk.Controllers;

[ApiController]
[Route("api/[controller]")]
[ExcludeFromCodeCoverage]
public class TeamController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly TeamService _teamService;

    public TeamController(TeamService teamService, IMapper mapper)
    {
        _teamService = teamService;
        _mapper = mapper;
    }


    [HttpPost, Route("find")]
    [SwaggerOperation(OperationId = nameof(Find))]
    [ProducesResponseType(typeof(List<TeamDto>), 200)]
    public async Task<IActionResult> Find(string keyword)
    {
        var items = await _teamService.FindAllAsync(keyword);

        var dtos = _mapper.Map<List<TeamDto>>(items.Take(100));
        return Ok(dtos);
    }
}
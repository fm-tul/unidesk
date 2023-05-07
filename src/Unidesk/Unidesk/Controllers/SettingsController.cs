using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services;

namespace Unidesk.Controllers;

[Route("/api/[controller]")]
[Authorize]
public class SettingsController : Controller
{
    private readonly SettingsService _settingsService;
    private readonly IMapper _mapper;
    private readonly IUserProvider _userProvider;
    public SettingsController(SettingsService settingsService, IMapper mapper, IUserProvider userProvider)
    {
        _settingsService = settingsService;
        _mapper = mapper;
        _userProvider = userProvider;
    }
    
    [HttpGet, Route("get-roles")]
    [SwaggerOperation(OperationId = nameof(GetRolesAndGrants))]
    [ProducesResponseType(typeof(List<UserRoleDto>), 200)]
    public async Task<IActionResult> GetRolesAndGrants()
    {
        var items = await _settingsService.GetRolesAsync();
        var dtos = _mapper.Map<List<UserRoleDto>>(items.ToList());
        return Ok(dtos);
    }
    
    [HttpPost, Route("save-role")]
    [SwaggerOperation(OperationId = nameof(SaveRole))]
    [ProducesResponseType(typeof(UserRoleDto), 200)]
    [RequireGrant(Grants.Action_ManageRolesAndGrants)]
    public async Task<IActionResult> SaveRole([FromBody] UserRoleDto dto, CancellationToken ct)
    {
        _userProvider.ValidateAndThrow(UserRoleDto.ValidateAndThrow, dto);
        
        var savedItem = await _settingsService.SaveRoleAsync(dto, ct);
        var savedDto = _mapper.Map<UserRoleDto>(savedItem);
        return Ok(savedDto);
    }
    
    [HttpDelete, Route("delete-role/{id:guid}")]
    [SwaggerOperation(OperationId = nameof(DeleteRole))]
    [ProducesResponseType(typeof(bool), 200)]
    [RequireGrant(Grants.Action_ManageRolesAndGrants)]
    public async Task<IActionResult> DeleteRole(Guid id, CancellationToken ct)
    {
        var item = await _settingsService.DeleteRoleAsync(id, ct);
        return Ok(item);
    }
    
    
}
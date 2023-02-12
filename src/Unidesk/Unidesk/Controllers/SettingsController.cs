using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Services;

namespace Unidesk.Controllers;

[Route("api/[controller]")]
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
    public async Task<IActionResult> SaveRole([FromBody] UserRoleDto dto)
    {
        _userProvider.ValidateAndThrow(UserRoleDto.ValidateAndThrow, dto);
        
        var item = _mapper.Map<UserRole>(dto);
        var savedItem = await _settingsService.SaveRoleAsync(item);
        var savedDto = _mapper.Map<UserRoleDto>(savedItem);
        return Ok(savedDto);
    }
}
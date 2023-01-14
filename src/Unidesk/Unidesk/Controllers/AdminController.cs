using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Dtos;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services;

namespace Unidesk.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    
    private readonly AdminService _adminService;
    private readonly IMapper _mapper;

    public AdminController(AdminService adminService, IMapper mapper)
    {
        _adminService = adminService;
        _mapper = mapper;
    }

    [RequireGrant(UserGrants.User_Admin_Id)]
    [HttpPost, Route("action")]
    [SwaggerOperation(OperationId = nameof(Action))]
    public async Task<object> Action(AdminActions action, CancellationToken ct)
    {
        return await _adminService.RunActionAsync(action, Request, Response, ct);
    }
    
    [RequireGrant(UserGrants.User_SuperAdmin_Id)]
    [HttpGet, Route("switch-user")]
    [SwaggerOperation(OperationId = nameof(SwitchUser))]
    public async Task<object> SwitchUser(string username, CancellationToken ct)
    {
        var user = await _adminService.SwitchUserAsync(username, ct);
        return _mapper.Map<UserDto>(user);
    }
}
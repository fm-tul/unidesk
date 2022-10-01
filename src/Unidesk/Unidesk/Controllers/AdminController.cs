using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
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

    public AdminController(AdminService adminService)
    {
        _adminService = adminService;
    }

    [RequireGrant(UserGrants.User_Admin_Id)]
    [HttpPost, Route("action")]
    [SwaggerOperation(OperationId = nameof(Action))]
    public async Task<object> Action(AdminActions action, CancellationToken ct)
    {
        return await _adminService.RunActionAsync(action, Request, Response, ct);
    }
}
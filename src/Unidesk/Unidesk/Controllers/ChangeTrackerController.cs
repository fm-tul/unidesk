using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db.Models;
using Unidesk.Dtos.Requests;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services;

namespace Unidesk.Controllers;

[ApiController]
[Authorize]
[Route("/api/[controller]")]
public class ChangeTrackerController : ControllerBase
{
 
    private readonly ChangeTrackerService _changeTrackerService;

    public ChangeTrackerController(ChangeTrackerService changeTrackerService)
    {
        _changeTrackerService = changeTrackerService;
    }
    
    [HttpPost, Route("find")]
    [RequireGrant(Grants.User_Admin)]
    [SwaggerOperation(OperationId = nameof(Find))]
    [ProducesResponseType(typeof(PagedResponse<ChangeLog>), 200)]
    public async Task<PagedResponse<ChangeLog>> Find(ChangeTrackerFilter filter, CancellationToken ct)
    {
        var pagedItems = await _changeTrackerService
           .Where(filter)
           .ApplyOrderBy(filter.Paging, (logs => logs.OrderByDescending(i => i.DateTime))) 
           .ToListWithPagingAsync(filter.Paging, ct);

        return pagedItems;
    }
}
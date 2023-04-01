using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db;
using Unidesk.Db.Models.Internships;
using Unidesk.Dtos.Internships;
using Unidesk.Dtos.Requests;
using Unidesk.Exceptions;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services;

namespace Unidesk.Controllers;

[Route("/api/[controller]")]
[Authorize]
public class InternshipController : Controller
{
    private readonly IMapper _mapper;
    private readonly InternshipService _internshipService;
    private readonly ILogger<InternshipController> _logger;
    private readonly IUserProvider _userProvider;

    public InternshipController(IMapper mapper, UnideskDbContext db, ILogger<InternshipController> logger, InternshipService internshipService, IUserProvider userProvider)
    {
        _mapper = mapper;
        _logger = logger;
        _internshipService = internshipService;
        _userProvider = userProvider;
    }

    [HttpGet, Route("get-one")]
    [SwaggerOperation(OperationId = nameof(GetOne))]
    [ProducesResponseType(typeof(InternshipDto), 200)]
    public async Task<IActionResult> GetOne(Guid id, CancellationToken ct)
    {
        var currentUser = _userProvider.CurrentUser;
        var item = await _internshipService.GetOneAsync(id, ct)
                ?? throw new NotFoundException("Internship not found");

        // check if the user is allowed to see the internship
        var hasAccess = item.StudentId == currentUser.Id
                     || _userProvider.HasSomeOfGrants(Grants.Internship_View, Grants.Internship_Manage);

        if (!hasAccess)
        {
            throw new NotAllowedException("You are not allowed to see this internship, only the student and managers can see it");
        }

        var dto = _mapper.Map<InternshipDto>(item);
        return Ok(dto);
    }

    [HttpPost, Route("find")]
    [SwaggerOperation(OperationId = nameof(Find))]
    [ProducesResponseType(typeof(PagedResponse<InternshipDto>), 200)]
    public async Task<IActionResult> Find([FromBody] InternshipFilter query, CancellationToken ct)
    {
        var canSeeAll = _userProvider.HasSomeOfGrants(Grants.Internship_Manage, Grants.Internship_View);
        if (canSeeAll)
        {
            var itemsAll = await _internshipService
               .Where(query)
               .ApplyOrderBy(query.Paging)
               .ToListWithPagingAsync<Internship, InternshipDto>(query.Paging, _mapper, ct);

            return Ok(itemsAll);
        }
        
        // only show the internships of the current user
        var currentUser = _userProvider.CurrentUser;
        var items = await _internshipService
           .Where(query)
           .Where(i => i.StudentId == currentUser.Id)
           .ApplyOrderBy(query.Paging)
           .ToListWithPagingAsync<Internship, InternshipDto>(query.Paging, _mapper, ct);
        
        return Ok(items);
    }

    [HttpPost, Route("upsert")]
    [SwaggerOperation(OperationId = nameof(Upsert))]
    [ProducesResponseType(typeof(InternshipDto), 200)]
    public async Task<IActionResult> Upsert([FromBody] InternshipDto dto, CancellationToken ct)
    {
        var isManager = _userProvider.HasGrant(Grants.Internship_Manage);
        InternshipDto.ValidateAndThrow(dto);

        if (!isManager && dto.Student.Id != _userProvider.CurrentUser.Id)
        {
            throw new NotAllowedException("You are not allowed to create or edit internships for other students");
        }
        
        var item = await _internshipService.UpsertAsync(dto, ct);
        var result = _mapper.Map<InternshipDto>(item);
        return Ok(result);
    }
    
    [HttpGet, Route("change-status")]
    [SwaggerOperation(OperationId = nameof(ChangeStatus))]
    [ProducesResponseType(typeof(InternshipDto), 200)]
    public async Task<IActionResult> ChangeStatus(Guid id, InternshipStatus status, CancellationToken ct)
    {
        var item = await _internshipService.GetOneAsync(id, ct)
                ?? throw new NotFoundException("Internship not found");

        var isManager = _userProvider.HasGrant(Grants.Internship_Manage);
        if (!isManager && item.StudentId != _userProvider.CurrentUser.Id)
        {
            throw new NotAllowedException("You are not allowed to change the status of internships for other students");
        }

        var newItem = await _internshipService.ChangeStatusAsync(item, status, isManager, ct);
        var result = _mapper.Map<InternshipDto>(newItem);
        return Ok(result);
    }
    

}
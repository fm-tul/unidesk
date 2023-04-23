using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.Requests;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services.Email;

namespace Unidesk.Controllers;

[ApiController]
[Authorize]
[Route("/api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly ILogger<EmailController> _logger;
    private readonly EmailService _emailService;
    private readonly IMapper _mapper;
    public EmailController(ILogger<EmailController> logger, EmailService emailService, IMapper mapper)
    {
        _logger = logger;
        _emailService = emailService;
        _mapper = mapper;
    }

    [HttpPost, Route("find")]
    [SwaggerOperation(OperationId = nameof(Find))]
    [ProducesResponseType(typeof(PagedResponse<EmailMessageDto>), 200)]
    [RequireGrant(Grants.Email_View)]
    public async Task<IActionResult> Find([FromBody] EmailFilter query, CancellationToken ct)
    {
        var emails = await _emailService
           .Where(query)
           .ApplyOrderBy(query.Paging)
           .ToListWithPagingAsync<EmailMessage, EmailMessageDto>(query.Paging, _mapper, ct);
        
        return Ok(emails);
    }
}
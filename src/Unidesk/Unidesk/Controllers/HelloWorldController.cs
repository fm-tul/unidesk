using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Unidesk.Reports.Elements;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services;
using Unidesk.Services.Email;
using Unidesk.Services.Reports;

namespace Unidesk.Controllers;

[ApiController]
[Authorize]
[Route("/api/[controller]")]
public class HelloWorldController : ControllerBase
{

    private readonly IUserProvider _userProvider;
    private readonly ReportService _reportService;
    private readonly EmailService _emailService;

    public HelloWorldController(IUserProvider userProvider, ReportService reportService, EmailService emailService)
    {
        _userProvider = userProvider;
        _reportService = reportService;
        _emailService = emailService;
    }

    [HttpGet]
    [Route("helloworld")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ReportQuestion), 200)]
    [ProducesResponseType(typeof(TextQuestion), 200)]
    public async Task<string> HelloWorld()
    {
        await _emailService.QueueTextEmailAsync("jan.hybs@tul.cz", "Database migrated", $"Database migrated at {DateTime.Now}", CancellationToken.None);
        return $"Hello {_userProvider.CurrentUser?.Email}";
    }
    
    
    [HttpGet]
    [Route("foo")]
    public async Task<IActionResult> Foo([FromQuery] ReportModel model)
    {
        var pdfBytes = await _reportService.GenerateReportAsync(model);
        if (pdfBytes == null)
        {
            return NotFound();
        }
        
        return File(pdfBytes, "application/pdf", "report.pdf");
    }
}
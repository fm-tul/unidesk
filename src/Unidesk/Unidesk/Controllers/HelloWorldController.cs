using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services;
using Unidesk.Services.Reports;

namespace Unidesk.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class HelloWorldController : ControllerBase
{

    private readonly IUserProvider _userProvider;
    private readonly ReportService _reportService;

    public HelloWorldController(IUserProvider userProvider, ReportService reportService)
    {
        _userProvider = userProvider;
        _reportService = reportService;
    }

    [HttpGet]
    [Route("helloworld")]
    [RequireGrant(UserGrants.User_SuperAdmin_Id)]
    public string HelloWorld()
    {
        return $"Hello {_userProvider.CurrentUser?.Email}";
    }
    
    [AllowAnonymous]
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
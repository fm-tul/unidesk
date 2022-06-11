using Microsoft.AspNetCore.Mvc;
using Unidesk.Services;
using Unidesk.Services.Stag;

namespace Unidesk.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImportController : ControllerBase
{
    
    private readonly StagService _stagService;
    private readonly IUserProvider _userProvider;


    public ImportController(StagService stagService, IUserProvider userProvider)
    {
        _stagService = stagService;
        _userProvider = userProvider;
    }

    [HttpGet]
    [Route("stag")]
    public async Task<IActionResult> ImportFromStag(int year, string department)
    {
        _userProvider.CurrentUser = _userProvider.CurrentUser ?? Db.Models.User.ImportUser;
        var items = await _stagService.ImportFromStagAsync(year, department);
        return Ok(items.Select(i => new { i.NameEng, i.Department, i.SchoolYear.Start.Year}));
    }
}
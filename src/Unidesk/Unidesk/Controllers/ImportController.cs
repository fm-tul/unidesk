using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Unidesk.Dtos;
using Unidesk.Services;
using Unidesk.Services.Stag;

namespace Unidesk.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImportController : ControllerBase
{
    
    private readonly StagService _stagService;
    private readonly IUserProvider _userProvider;
    private IMapper _mapper;


    public ImportController(StagService stagService, IUserProvider userProvider, IMapper mapper)
    {
        _stagService = stagService;
        _userProvider = userProvider;
        _mapper = mapper;
    }

    [HttpGet]
    [Route("stag")]
    public async Task<IActionResult> ImportFromStag(int year, string department)
    {
        _userProvider.CurrentUser = _userProvider.CurrentUser ?? Db.Models.User.ImportUser;
        var items = await _stagService.ImportFromStagAsync(year, department);
        var dtos = _mapper.Map<List<ThesisDto>>(items);
        return Ok(dtos);
    }
}
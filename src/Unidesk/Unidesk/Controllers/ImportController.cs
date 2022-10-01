using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Services;
using Unidesk.Services.Stag;
using Unidesk.Services.Stag.Models;

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

    [HttpGet, Route("stag-import-all")]
    [SwaggerOperation(OperationId = nameof(ImportFromStag))]
    [ProducesResponseType(typeof(List<ThesisDto>), 200)]
    public async Task<IActionResult> ImportFromStag(int year, string department)
    {
        _userProvider.CurrentUser = _userProvider.CurrentUser ?? StaticUsers.ImportUser;
        var items = await _stagService.ImportFromStagAsync(year, department);
        var dtos = _mapper.Map<List<ThesisDto>>(items);
        return Ok(dtos);
    }
    
    [HttpPost, Route("stag-import-one")]
    [SwaggerOperation(OperationId = nameof(ImportOneFromStag))]
    [ProducesResponseType(typeof(ThesisDto), 200)]
    public async Task<IActionResult> ImportOneFromStag(ImportOneRequest body)
    {
        _userProvider.CurrentUser = _userProvider.CurrentUser ?? StaticUsers.ImportUser;
        var prace = JsonConvert.DeserializeObject<KvalifikacniPrace>(body.Data)
            ?? throw new ArgumentException("Invalid data");
        var item = await _stagService.ImportOneFromStagAsync(prace);
        var dto = _mapper.Map<ThesisDto>(item);
        return Ok(dto);
    }
}

public class ImportOneRequest
{
    public string Data { get; set; }
}
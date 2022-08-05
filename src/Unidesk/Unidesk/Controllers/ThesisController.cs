using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db;
using Unidesk.Dtos;
using Unidesk.Dtos.Requests;

namespace Unidesk.Controllers;

[Route("api/[controller]")]
public class ThesisController : Controller
{
    private readonly IMapper _mapper;
    private readonly UnideskDbContext _db;

    public ThesisController(IMapper mapper, UnideskDbContext db)
    {
        _mapper = mapper;
        _db = db;
    }

    [HttpGet, Route("list")]
    [SwaggerOperation(OperationId = nameof(GetAll))]
    [ProducesResponseType(typeof(List<ThesisDto>), 200)]
    public async Task<IActionResult> GetAll([FromQuery] ThesisFilter filter)
    {
        var query = _db.Theses
            .Include(i => i.KeywordThesis)
            .ThenInclude(i => i.Keyword)
            .AsQueryable();
        
        if (filter.UserId.HasValue)
        {
            query = query.Where(i => i.Users.Any(j => j.Id == filter.UserId));
        }

        if (filter.Keywords.Any() && filter.Keywords.Count == 1)
        {
            var kw = filter.Keywords.First();
            query = query.Where(i => i.KeywordThesis.Any(j => j.KeywordId == kw));
        }

        if (filter.Status.HasValue)
        {
            query = query.Where(i => i.Status == filter.Status.Value);
        }

        if (filter.HasKeywords.HasValue)
        {
            query = filter.HasKeywords.Value
                ? query.Where(i => i.KeywordThesis.Any())
                : query.Where(i => !i.KeywordThesis.Any());
        }
        
        var items = await query
            .ApplyPaging(filter)
            .ToListAsync();
        
        var dtos = _mapper.Map<List<ThesisDto>>(items);

        return Ok(dtos);
    }
}
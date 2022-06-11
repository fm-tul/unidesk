using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Dtos;
using Unidesk.Dtos.Requests;

namespace Unidesk.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class KeywordsController : ControllerBase
{
    private readonly UnideskDbContext _db;
    private readonly IMapper _mapper;

    public KeywordsController(UnideskDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }
    
    
    [HttpGet]
    [Route("all")]
    public async Task<IActionResult> GetAllKeywords([FromQuery] PagedQuery? query = null)
    {
        var keywords = await _db.Keywords
            .Include(i => i.KeywordThesis)
            .OrderByDescending(i => i.KeywordThesis.Count)
            .ApplyPaging(query)
            .ToListAsync();

        var keywordsDto = _mapper
            .Map<List<KeywordDto>>(keywords);
        
        return Ok(keywordsDto);
    }
}
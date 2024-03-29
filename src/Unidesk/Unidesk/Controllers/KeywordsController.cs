﻿using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.Requests;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services;

namespace Unidesk.Controllers;

[ApiController]
[Authorize]
[Route("/api/[controller]")]
public class KeywordsController : ControllerBase
{
    private readonly UnideskDbContext _db;
    private readonly IMapper _mapper;
    private readonly KeywordsService _keywordsService;

    public KeywordsController(UnideskDbContext db, IMapper mapper, KeywordsService keywordsService)
    {
        _db = db;
        _mapper = mapper;
        _keywordsService = keywordsService;
    }


    [HttpPost, Route("all")]
    [SwaggerOperation(OperationId = nameof(GetAll))]
    [ProducesResponseType(typeof(PagedResponse<KeywordDto>), 200)]
    public async Task<IActionResult> GetAll([FromBody] KeywordFilter filter, CancellationToken ct)
    {
        var query = _keywordsService.WhereFilter(filter, includeUsage: true);

        var response = await query
            .OrderByDescending(i => i.KeywordThesis.Count)
            .ToListWithPagingAsync<Keyword, KeywordDto>(filter.Paging, _mapper, ct);
        
        return Ok(response);
    }

    [HttpGet, Route("find")]
    [SwaggerOperation(OperationId = nameof(Find))]
    [ProducesResponseType(typeof(List<KeywordDto>), 200)]
    public async Task<IActionResult> Find(string keyword)
    {
        var pageSize = 50;
        var keywords = await _keywordsService.FindAsync(keyword, pageSize, includeUsage: true);

        var keywordsDto = _mapper
            .Map<List<KeywordDto>>(keywords);

        return Ok(keywordsDto);
    }
    
    [HttpGet, Route("find-related")]
    [SwaggerOperation(OperationId = nameof(FindRelated))]
    [ProducesResponseType(typeof(List<KeywordDto>), 200)]
    public async Task<IActionResult> FindRelated(Guid keywordId)
    {
        var keywords = await _keywordsService.FindRelatedKeywords(keywordId);

        var keywordsDto = _mapper
            .Map<List<KeywordDto>>(keywords);

        return Ok(keywordsDto);
    }

    [HttpGet, Route("find-duplicates")]
    [RequireGrant(Grants.Action_Merge_Keywords)]
    [SwaggerOperation(OperationId = nameof(FindDuplicates))]
    [ProducesResponseType(typeof(List<SimilarKeywordDto>), 200)]
    public async Task<IActionResult> FindDuplicates(string? keyword = null)
    {
        var keywordsList = string.IsNullOrEmpty(keyword)
            ? _db.Keywords.ToList()
            : await _keywordsService.FindAsync(keyword, 100);

        var keywordsByLocale = keywordsList.GroupBy(i => i.Locale);
        var results = new List<SimilarKeywordDto>();

        foreach (var keywords in keywordsByLocale)
        {
            var similar = _keywordsService.FindDuplicates(keywords.ToList(), string.IsNullOrWhiteSpace(keyword));
            var dtos = _mapper.Map<List<SimilarKeywordDto>>(similar);
            results.AddRange(dtos);
        }

        return Ok(results);
    }

    [HttpGet, Route("merge")]
    [SwaggerOperation(OperationId = nameof(Merge))]
    [RequireGrant(Grants.Action_Merge_Keywords)]
    public async Task<IActionResult> Merge(Guid keywordMain, Guid keywordAlias)
    {
        await _keywordsService.MergeAsync(keywordMain, keywordAlias);
        return Ok();
    }
    
    [HttpPost, Route("merge-multiple")]
    [SwaggerOperation(OperationId = nameof(MergeMultiple))]
    [RequireGrant(Grants.Action_Merge_Keywords)]
    public async Task<IActionResult> MergeMultiple(MergePairs pairs)
    {
        foreach (var keyword in pairs.Pairs)
        {
            await _keywordsService.MergeAsync(keyword.Main, keyword.Alias);
        }
        return Ok();
    }
}


public class MergePair
{
    public Guid Main { get; set; }
    public Guid Alias { get; set; }
}
public class MergePairs
{
    public List<MergePair> Pairs { get; set; } = new();
}

public class SimilarKeywordDto
{
    public int Distance { get; set; }
    public double Similarity { get; set; }
    public KeywordDto Keyword1 { get; set; }
    public KeywordDto Keyword2 { get; set; }

    public string Locale => Keyword1.Locale;
}
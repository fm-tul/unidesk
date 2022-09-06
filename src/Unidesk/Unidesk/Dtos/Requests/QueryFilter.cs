﻿using System.ComponentModel.DataAnnotations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Unidesk.Dtos.Requests;

public class QueryFilter
{
    /// <summary>
    /// starting from 1
    /// </summary>
    [Required]
    public int Page { get; set; } = 1;

    [Required]
    public int PageSize { get; set; } = 20;

    public string? OrderBy { get; set; }

    public bool OrderAscending { get; set; }

    public int Total { get; set; }
    
    
    public static readonly QueryFilter DefaultQueryFilter = new QueryFilter
    {
        Page = 1,
        PageSize = 20,
        OrderBy = null,
        OrderAscending = true
    };
}

public static class IQueryableExtensions
{
    public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, QueryFilter? queryFilter)
    {
        if (queryFilter is null)
        {
            return query;
        }

        queryFilter.Page = Math.Max(queryFilter.Page, 1);
        queryFilter.PageSize = Math.Clamp(queryFilter.PageSize, 1, 500);

        return query
            .Skip((queryFilter.Page - 1) * queryFilter.PageSize)
            .Take(queryFilter.PageSize);
    }


    public static async Task<PagedResponse<TDto>> ToListWithPagingAsync<TEntity, TDto>(this IQueryable<TEntity> query, QueryFilter? pagedQuery, IMapper mapper)
        where TEntity : class
        where TDto : class
    {
        var hasTotal = query.TryGetNonEnumeratedCount(out var total);
        total = hasTotal ? total : await query.CountAsync();
        var items = await query.ApplyPaging(pagedQuery).ToListAsync();
        var dtos = mapper.Map<List<TDto>>(items);
        var response = PagedResponse<TDto>.Create(dtos, pagedQuery, total);

        return response;
    }
}
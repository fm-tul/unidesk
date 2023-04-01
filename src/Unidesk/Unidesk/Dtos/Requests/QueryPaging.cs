using System.ComponentModel.DataAnnotations;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db.Core;

namespace Unidesk.Dtos.Requests;

public class QueryPaging
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


    public static readonly QueryPaging DefaultQueryPaging = new()
    {
        Page = 1,
        PageSize = 20,
        OrderBy = null,
        OrderAscending = true,
    };
}

public static class IQueryableExtensions
{
    public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, QueryPaging? queryFilter)
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


    public static async Task<PagedResponse<TDto>> ToListWithPagingAsync<TEntity, TDto>(this IQueryable<TEntity> query, QueryPaging? queryFilter, IMapper mapper, CancellationToken ct)
        where TEntity : class
        where TDto : class
    {
        var hasTotal = query.TryGetNonEnumeratedCount(out var total);
        total = hasTotal ? total : await query.CountAsync(ct);
        var pagedQuery = query.ApplyPaging(queryFilter);
        var items = await pagedQuery.ToListAsync(ct);
        var dtos = mapper.Map<List<TDto>>(items);
        var response = PagedResponse<TDto>.Create(dtos, queryFilter, total);

        return response;
    }

    public static async Task<PagedResponse<ITitem>> ToListWithPagingAsync<ITitem>(this IQueryable<ITitem> query, QueryPaging? queryFilter, CancellationToken ct)
        where ITitem : class
    {
        var hasTotal = query.TryGetNonEnumeratedCount(out var total);
        total = hasTotal ? total : await query.CountAsync(ct);
        var pagedQuery = query.ApplyPaging(queryFilter);
        var items = await pagedQuery.ToListAsync(ct);
        var response = PagedResponse<ITitem>.Create(items, queryFilter, total);
    
        return response;
    }

    public static IQueryable<T> ApplyOrderBy<T>(this IQueryable<T> query, QueryPaging? queryFilter) where T : TrackedEntity
    {
        if (queryFilter is null || string.IsNullOrWhiteSpace(queryFilter.OrderBy))
        {
            return query.OrderByDescending(i => i.Created);
        }

        return queryFilter.OrderAscending
            ? query.OrderBy(x => EF.Property<T>(x!, queryFilter.OrderBy))
            : query.OrderByDescending(x => EF.Property<T>(x!, queryFilter.OrderBy));
    }

    public static IQueryable<T> ApplyOrderBy<T>(this IQueryable<T> query, QueryPaging? queryFilter, Func<IQueryable<T>, IOrderedQueryable<T>> defaultOrder)
    {
        if (queryFilter is null || string.IsNullOrWhiteSpace(queryFilter.OrderBy))
        {
            return defaultOrder(query);
        }

        return queryFilter.OrderAscending
            ? query.OrderBy(x => EF.Property<T>(x!, queryFilter.OrderBy))
            : query.OrderByDescending(x => EF.Property<T>(x!, queryFilter.OrderBy));
    }
}
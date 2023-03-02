using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Swashbuckle.AspNetCore.Annotations;

namespace Unidesk.Dtos.Requests;

public class PagedResponse<T> where T : class
{
    [Required]
    public QueryPaging Paging { get; set; }

    [Required]
    public IEnumerable<T> Items { get; set; }

    [SuppressMessage("ReSharper", "PossibleMultipleEnumeration")]
    public static PagedResponse<T> Create(IEnumerable<T> items, QueryPaging? query, int? total)
    {
        query = query ?? QueryPaging.DefaultQueryPaging;
        return new PagedResponse<T>
        {
            Items = items,
            Paging = new QueryPaging
            {
                Page = query.Page,
                PageSize = query.PageSize,
                OrderAscending = query.OrderAscending,
                OrderBy = query.OrderBy,
                Total = total ?? items.Count(),
            },
        };
    }
}
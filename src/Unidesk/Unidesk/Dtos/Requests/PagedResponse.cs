using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Swashbuckle.AspNetCore.Annotations;

namespace Unidesk.Dtos.Requests;

public class PagedResponse<T> where T : class
{
    [Required]
    public QueryFilter Filter { get; set; }

    [Required]
    public IEnumerable<T> Items { get; set; }

    [SuppressMessage("ReSharper", "PossibleMultipleEnumeration")]
    public static PagedResponse<T> Create(IEnumerable<T> items, QueryFilter? query, int? total)
    {
        query = query ?? QueryFilter.DefaultQueryFilter;
        return new PagedResponse<T>
        {
            Items = items,
            Filter = new QueryFilter
            {
                Page = query.Page,
                PageSize = query.PageSize,
                OrderAscending = query.OrderAscending,
                OrderBy = query.OrderBy,
                Total = total ?? items.Count()
            }
        };
    }
}
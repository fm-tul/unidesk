namespace Unidesk.Dtos.Requests;

public class PagedQuery
{
    /// <summary>
    /// starting from 1
    /// </summary>
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    public string? OrderBy { get; set; }
    public bool OrderAscending { get; set; }
}

public static class IQueryableExtensions
{
    public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, PagedQuery? pagedQuery)
    {
        if (pagedQuery is null)
        {
            return query;
        }
        
        pagedQuery.Page = Math.Max(pagedQuery.Page, 1);
        pagedQuery.PageSize = Math.Clamp(pagedQuery.PageSize, 1, 500);

        return query
            .Skip((pagedQuery.Page - 1) * pagedQuery.PageSize)
            .Take(pagedQuery.PageSize);
    }
}
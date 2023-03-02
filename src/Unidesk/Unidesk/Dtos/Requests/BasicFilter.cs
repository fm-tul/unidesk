namespace Unidesk.Dtos.Requests;

public class BasicFilter: IFilter
{
    public QueryPaging? Paging { get; set; }

    public string? Keyword { get; set; }
}
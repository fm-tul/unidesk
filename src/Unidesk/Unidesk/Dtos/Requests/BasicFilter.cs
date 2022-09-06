namespace Unidesk.Dtos.Requests;

public class BasicFilter: IFilter
{
    public QueryFilter? Filter { get; set; }

    public string? Keyword { get; set; }
}
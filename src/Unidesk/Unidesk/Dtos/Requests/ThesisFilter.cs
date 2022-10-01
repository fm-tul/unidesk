using Unidesk.Db.Models;

namespace Unidesk.Dtos.Requests;

public class ThesisFilter : IFilter
{
    public QueryFilter Filter { get; set; }
    public Guid? UserId { get; set; }
    public List<Guid> Keywords { get; set; } = new();
    
    public ThesisStatus? Status { get; set; }
    
    public bool? HasKeywords { get; set; }
    public string? Keyword { get; set; }
}
using Unidesk.Db.Models;

namespace Unidesk.Dtos.Requests;

public class ThesisFilter : IFilter
{
    public QueryPaging Paging { get; set; }
    public Guid? UserId { get; set; }
    public List<Guid> Keywords { get; set; } = new();
    public Operator Operator { get; set; }
    
    public ThesisStatus? Status { get; set; }
    
    public bool? HasKeywords { get; set; }
    public string? Keyword { get; set; }
    
    public Guid? SchoolYearId { get; set; }
    
    public bool MyThesis { get; set; }
}
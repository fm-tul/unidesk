using Unidesk.Db.Models.Internships;

namespace Unidesk.Dtos.Requests;

public class InternshipFilter : IFilter
{
    public QueryPaging Paging { get; set; }
    public Guid? StudentId { get; set; }
    public List<Guid> Keywords { get; set; } = new();
    public Operator Operator { get; set; }
    public bool? ShowArchived { get; set; }
    
    public InternshipStatus? Status { get; set; }
    public Guid? SchoolYearId { get; set; }
}
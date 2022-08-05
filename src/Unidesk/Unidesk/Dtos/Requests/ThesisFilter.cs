using Unidesk.Db.Models;

namespace Unidesk.Dtos.Requests;

public class ThesisFilter : PagedQuery
{
    public Guid? UserId { get; set; }
    public List<Guid> Keywords { get; set; } = new List<Guid>();
    
    public ThesisStatus? Status { get; set; }
    
    public bool? HasKeywords { get; set; }
}
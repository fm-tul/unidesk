using Microsoft.EntityFrameworkCore;
using Unidesk.Db.Models;

namespace Unidesk.Dtos.Requests;

public class ChangeTrackerFilter : IFilter
{
    public QueryPaging Paging { get; set; }
    
    public ChangeState? State { get; set; }
    public string? Entity { get; set; }
    public string? User { get; set; }
    public Guid? EntityId { get; set; }
}
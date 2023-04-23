using Unidesk.Db.Models;
using Unidesk.Db.Models.Internships;

namespace Unidesk.Dtos.Requests;

public class EmailFilter : IFilter
{
    public QueryPaging Paging { get; set; }
    public string? From { get; set; }
    public string? To { get; set; }
    public string? Subject { get; set; }
    public string? Body { get; set; }
    public EmailStatus? Status { get; set; }
    public ApplicationModule? Module { get; set; }
}
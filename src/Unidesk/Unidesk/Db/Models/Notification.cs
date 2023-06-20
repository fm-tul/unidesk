using Unidesk.Db.Core;
using Unidesk.Db.Models.Internships;

namespace Unidesk.Db.Models;

public class Notification : TrackedEntity
{
    public string? Subject { get; set; }
    public string? Body { get; set; }
    public NotificationType Type {get; set; }
    
    // links to services
    public Guid? EmailMessageId { get; set; }
    public EmailMessage? EmailMessage { get; set; }
    
    // links to various Entities below
    public Guid? InternshipId { get; set; }
    public Internship? Internship { get; set; } 
    public Guid? EvaluationId { get; set; }
    public Evaluation? Evaluation { get; set; }
}
using Unidesk.Db.Models;

namespace Unidesk.Dtos;

public class EmailMessageDto : TrackedEntityDto
{
    public string To { get; set; }
    public string From { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
 
    public int AttemptCount { get; set; }
    public DateTime? LastAttempt { get; set; }
    
    public DateTime ScheduledToBeSent { get; set; }
    
    public EmailStatus Status { get; set; }
    public ApplicationModule Module { get; set; }
}
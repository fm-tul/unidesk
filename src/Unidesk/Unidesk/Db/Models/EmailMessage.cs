using System.Text.Json.Serialization;
using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class EmailMessage : TrackedEntity
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
    
    // NOTE: this is not a foreign key, because the document can be deleted
    // and we still want to keep the email in the database
    public Guid? DocumentId { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum EmailStatus
{
    InQueue = 0,
    Sent = 1,
    Failed = 2,
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ApplicationModule
{
    Unknown = 0,
    Account = 1,
    Thesis = 2,
    Internship = 3,
    Report = 4,
    Evaluation = 5,
}
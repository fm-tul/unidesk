using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class ReportUser : TrackedEntity, ISimpleUser
{
    public string? StagId { get; set; }
    
    public Guid? UserId { get; set; }
    public User User { get; set; }

    public string Username { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? MiddleName { get; set; }
    public string? TitleBefore { get; set; }
    public string? TitleAfter { get; set; }

    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Company { get; set; }
    public string? Address { get; set; }
    public string? Position { get; set; }
}
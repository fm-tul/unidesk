using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class User : TrackedEntity, ISimpleUser
{
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
    
    public Guid? AvatarId { get; set; }
    public Document Avatar { get; set; }
    
    public string Work { get; set; }
    public string WorkAddress { get; set; }
    public string WorkPosition { get; set; }
    public List<UserRole> Roles { get; set; }

    public List<UserInTeam> UserInTeams { get; set; }
}
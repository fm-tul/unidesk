using Unidesk.Db.Core;
using Unidesk.Security;

namespace Unidesk.Db.Models;

public class User : TrackedEntity, ISimpleUser
{
    public string? Username { get; set; }
    public string? StagId { get; set; }
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
    public Document? Avatar { get; set; }
    
    public string? Work { get; set; }
    public string? WorkAddress { get; set; }
    public string? WorkPosition { get; set; }
    public List<UserRole> Roles { get; set; } = new List<UserRole>();

    public List<UserInTeam> UserInTeams { get; set; } = new List<UserInTeam>();

    public static readonly User Guest = new User
    {
        Id = Guid.Empty,
        Username = "Guest",
        FirstName = "Guest",
        LastName = "Guest",
        MiddleName = "Guest",
        Email = "guest@unidesk.com",
        Roles = new List<UserRole>()
        {
            new UserRole()
            {
                Name = "Guest",
                Grants = new List<Grant>()
                {
                    UserGrants.User_Guest,
                }
            }
        }
    };
    
    public static readonly User ImportUser = new User
    {
        Id = Guid.Empty,
        Username = "Import",
        FirstName = "Import",
        LastName = "Import",
        MiddleName = "Import",
        Email = "import-user@unidesk.com",
        Roles = new List<UserRole>()
        {
            new UserRole()
            {
                Name = "Import",
                Grants = new List<Grant>()
                {
                    UserGrants.User_SuperAdmin
                }
            }
        }
    };
    
    public static readonly User InitialSeedUser = new User
    {
        Id = Guid.Empty,
        Username = "InitialSeed",
        FirstName = "InitialSeed",
        LastName = "InitialSeed",
        MiddleName = "InitialSeed",
        Email = "seed@unidesk.com",
        Roles = new List<UserRole>()
        {
            new UserRole()
            {
                Name = "InitialSeed",
                Grants = new List<Grant>()
                {
                    UserGrants.User_SuperAdmin
                }
            }
        }
    };
}
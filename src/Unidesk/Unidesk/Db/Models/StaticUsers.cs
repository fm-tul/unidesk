using Unidesk.Security;

namespace Unidesk.Db.Models;

public static class StaticUsers
{
    
    public static readonly User Guest = new()
    {
        Id = Guid.Empty,
        Username = "Guest",
        FirstName = "Guest",
        LastName = "Guest",
        MiddleName = "Guest",
        Email = "guest@unidesk.com",
        Roles = new List<UserRole>()
        {
            new()
            {
                Name = "Guest",
                Grants = new List<Grant>()
                {
                    UserGrants.User_Guest,
                }
            }
        }
    };
    
    public static readonly User ImportUser = new()
    {
        Id = Guid.Empty,
        Username = "Import",
        FirstName = "Import",
        LastName = "Import",
        MiddleName = "Import",
        Email = "import-user@unidesk.com",
        Roles = new List<UserRole>()
        {
            new()
            {
                Name = "Import",
                Grants = new List<Grant>()
                {
                    UserGrants.User_SuperAdmin
                }
            }
        }
    };
    
    public static readonly User InitialSeedUser = new()
    {
        Id = Guid.Empty,
        Username = "InitialSeed",
        FirstName = "InitialSeed",
        LastName = "InitialSeed",
        MiddleName = "InitialSeed",
        Email = "seed@unidesk.com",
        Roles = new List<UserRole>()
        {
            new()
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
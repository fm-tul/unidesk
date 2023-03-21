using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Unidesk.Client;
using Unidesk.Db.Core;
using Unidesk.Security;
using Unidesk.Server;

namespace Unidesk.Db.Models;

public class UserRole : TrackedEntity
{
    public string Name { get; set; }

    public string? Description { get; set; }
    
    [IgnoreMapping]
    public List<User> Users { get; set; } = new List<User>();

    [Column("Grants")]
    internal string _grants { get; set; } = "";

    [NotMapped]
    [Required]
    public List<Grant> Grants
    {
        get => _grants
            .Split(',')
            .Where(g => !string.IsNullOrWhiteSpace(g))
            .Select(Guid.Parse)
            .Select(i => UserGrants.All.FirstOrDefault(j => i == j.Id))
            .Where(i => i != null)
            .Cast<Grant>()
            .ToList();

        set => _grants = string.Join(",", value.Select(i => i.Id));
    }
}

// Not in DB
public class Grant : IdEntity
{
    [Required]
    public string Name { get; set; }
    public string Description { get; set; }
}

public static class UserRoles {
    public static UserRole SuperAdmin = new() {
        Id = new Guid("59DCEA80-1F2C-406E-A20D-2AEFA8DD4094"),
        Name = "Admin",
        Grants = UserGrants.All.ToList(),
    };
}
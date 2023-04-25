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

    public List<User> Users { get; set; } = new();

    [Column("Grants")]
    public string _grantsRaw { get; set; } = "";

    [NotMapped]
    [Required]
    public List<Grant> Grants
    {
        get => _grantsRaw
           .Split(',')
           .Where(g => !string.IsNullOrWhiteSpace(g))
           .Select(Guid.Parse)
           .Select(i => UserGrants.All.FirstOrDefault(j => i == j.Id))
           .Where(i => i != null)
           .Select(i => i!.AsGrant())
           .ToList();

        set => _grantsRaw = string.Join(",", value.Select(i => i.Id));
    }
}

// Not in DB
public class Grant : IdEntity
{
    [Required]
    public string Name { get; set; }

    public string Description { get; set; }
    
    public static Grant FromAttributeInfoItem(AttributeInfoItem item) => new()
    {
        Id = item.Id,
        Name = item.Name,
        Description = item.Description
    };
}

public static class UserRoles
{
    public static UserRole SuperAdmin = new()
    {
        Id = new Guid("59DCEA80-1F2C-406E-A20D-2AEFA8DD4094"),
        Name = "Admin",
        Grants = UserGrants.All.Select(Grant.FromAttributeInfoItem).ToList()
    };
}
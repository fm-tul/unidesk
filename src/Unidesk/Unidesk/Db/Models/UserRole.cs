using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Unidesk.Client;
using Unidesk.Db.Core;
using Unidesk.Security;

namespace Unidesk.Db.Models;

public class UserRole : TrackedEntity
{
    public string Name { get; set; }

    public string? Description { get; set; }

    [Column("Grants")]
    internal string _grants { get; set; } = "";

    [NotMapped]
    [Required]
    public List<Grant> Grants
    {
        get => _grants
            .Split(',')
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
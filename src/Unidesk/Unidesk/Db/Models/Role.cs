using System.ComponentModel.DataAnnotations.Schema;
using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class UserRole : TrackedEntity
{
    public string Name { get; set; }

    public string Description { get; set; }
    public string GrantsSerialized { get; set; } = "";

    [NotMapped]
    public List<Grant> Grants
    {
        get => GrantsSerialized
                .Split(',')
                .Select(Guid.Parse)
                .Select(i => UserGrants.All.FirstOrDefault(j => i == j.Id))
                .Where(i => i != null)
                .Cast<Grant>()
                .ToList();
        
        set => GrantsSerialized = string.Join(",", value.Select(i => i.Id));
    }
}

// Not in DB
public class Grant
{
    public Guid Id = Guid.NewGuid();
    public string Name { get; set; }
    public string Description { get; set; }
}

public static class UserGrants
{
    public static IEnumerable<Grant> All => new List<Grant>();
}
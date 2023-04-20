using Unidesk.Db.Models;

namespace Unidesk.Security;

public static class UserGrants
{
    public static readonly List<Grant> All = Enum.GetValues<Grants>()
       .Select(i => new Grant
        {
            Name = i.GrantName(),
            Description = i.GrantDescription(),
            Id = i.GrantId(),
        })
       .ToList();

    public static Grant GetGrant(Guid id) => All.First(i => i.Id == id);
}
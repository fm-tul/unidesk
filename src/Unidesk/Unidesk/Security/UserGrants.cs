using Unidesk.Db.Models;

namespace Unidesk.Security;

public static class UserGrants
{
    public static readonly List<AttributeInfoItem> All = Enum.GetValues<Grants>()
       .Select(i => new AttributeInfoItem
        {
            Name = i.GrantName(),
            Description = i.GrantDescription(),
            Id = i.GrantId(),
        })
       .ToList();
}
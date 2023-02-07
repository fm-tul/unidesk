using Microsoft.OpenApi.Extensions;
using Unidesk.Db.Models;

namespace Unidesk.Security;

public static class GrantsExtensions
{
    private static GrantInfoAttribute GetGrantInfo(Grants grant) =>
        grant.GetAttributeOfType<GrantInfoAttribute>()
     ?? throw new Exception($"Grant {grant} has no GrantInfoAttribute");

    public static string GrantName(this Grants grant) => GetGrantInfo(grant).Name;
    public static string GrantDescription(this Grants grant) => GetGrantInfo(grant).Description;
    public static Guid GrantId(this Grants grant) => GetGrantInfo(grant).Id;
    
    public static Grant AsGrant(this Grants grant) => UserGrants.GetGrant(grant.GrantId());
    
    public static Grant AsGrant(this GrantInfoAttribute grantInfo) => UserGrants.GetGrant(grantInfo.Id);
}
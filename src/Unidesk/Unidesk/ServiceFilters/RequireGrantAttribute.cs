using Unidesk.Db.Models;
using Unidesk.Security;

namespace Unidesk.ServiceFilters;

public class RequireGrantAttribute : Attribute
{
    public readonly Grant Grant;

    public RequireGrantAttribute(string grant)
    {
        Grant = UserGrants.GetGrant(grant);
    }
}
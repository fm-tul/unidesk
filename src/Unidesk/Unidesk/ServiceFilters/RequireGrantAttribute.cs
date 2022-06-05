using Unidesk.Db.Models;

namespace Unidesk.ServiceFilters;

public class RequireGrantAttribute : Attribute
{
    public readonly Grant Grant;

    public RequireGrantAttribute(string grant)
    {
        Grant = UserGrants.GetGrant(grant);
    }
}
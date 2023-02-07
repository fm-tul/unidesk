using Unidesk.Db.Models;
using Unidesk.Security;

namespace Unidesk.ServiceFilters;

public class RequireGrantAttribute : Attribute
{
    public Grant Grant { get; }

    public RequireGrantAttribute(Grants grant)
    {
        Grant = grant.AsGrant();
    }
}
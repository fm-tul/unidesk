using Unidesk.Db.Models;
using Unidesk.Security;

namespace Unidesk.ServiceFilters;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
public class RequireGrantAttribute : Attribute
{
    public Grant Grant { get; }

    public RequireGrantAttribute(Grants grant)
    {
        Grant = grant.AsGrant();
    }
}
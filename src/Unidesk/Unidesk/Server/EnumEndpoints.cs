using Unidesk.Security;
using Unidesk.Server.ServiceFilters;

namespace Unidesk.Server;

public static class EnumsCachedEndpoint
{
    public const string EnumsSwaggerTag = "Enums";
    public const string EnumsCacheTag = "Enums";

    public static RouteHandlerBuilder UseEnumsCachedEndpoint<TResponse>(this RouteHandlerBuilder builder, string operationName)
    {
        return builder
           .WithTags(EnumsSwaggerTag)
           .WithName(operationName)
           .Produces<TResponse>();
    }

    public static RouteHandlerBuilder UseEnumsEndpoint<TResponse>(this RouteHandlerBuilder builder, string operationName, Grants? grant = null)
    {
        var b = builder
           .WithTags(EnumsSwaggerTag)
           .WithName(operationName)
           .Produces<TResponse>();

        if (grant.HasValue)
        {
            b = b.RequireGrant(grant.Value);
        }
        
        return b;
    }
}
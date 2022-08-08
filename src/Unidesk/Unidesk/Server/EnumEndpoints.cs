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
            .Produces<TResponse>()
            .CacheOutput(policyBuilder =>
            {
                policyBuilder.Expire(TimeSpan.FromMinutes(15));
                policyBuilder.Tag(EnumsCacheTag);
            });
    }

    public static RouteHandlerBuilder UseEnumsEndpoint<TResponse>(this RouteHandlerBuilder builder, string operationName)
    {
        return builder
            .WithTags(EnumsSwaggerTag)
            .WithName(operationName)
            .Produces<TResponse>();
    }
}
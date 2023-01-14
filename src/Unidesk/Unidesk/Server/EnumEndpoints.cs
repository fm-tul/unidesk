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

    public static RouteHandlerBuilder UseEnumsEndpoint<TResponse>(this RouteHandlerBuilder builder, string operationName)
    {
        return builder
            .WithTags(EnumsSwaggerTag)
            .WithName(operationName)
            .Produces<TResponse>();
    }
}
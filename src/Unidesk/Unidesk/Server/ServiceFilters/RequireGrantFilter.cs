using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services;

namespace Unidesk.Server.ServiceFilters;

public class RequireGrantFilter : IActionFilter
{
    private readonly IUserProvider? _userProvider;

    public RequireGrantFilter(IUserProvider userProvider)
    {
        _userProvider = userProvider;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        var requiredAttributes = context.ActionDescriptor.EndpointMetadata
           .OfType<RequireGrantAttribute>()
           .ToList();

        GrantCheck.HasGrant(_userProvider!.CurrentUser, requiredAttributes, context.ActionDescriptor.DisplayName)
           .Match(
                _ => null,
                i => context.Result = i
            );
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}

public static class RequireGrantFilterExtensions
{
    public static TBuilder RequireGrant<TBuilder>(this TBuilder builder, Grants grant)
        where TBuilder : IEndpointConventionBuilder
    {
        builder.WithMetadata(new RequireGrantAttribute(grant));
        return builder;
    }
}

public class RequireGrantEndpointFilter : IEndpointFilter
{
    private readonly IUserProvider? _userProvider;

    public RequireGrantEndpointFilter(IUserProvider? userProvider)
    {
        _userProvider = userProvider;
    }

    public ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var requiredAttributes = context.HttpContext.GetEndpoint()?.Metadata
           .OfType<RequireGrantAttribute>()
           .ToList() ?? new List<RequireGrantAttribute>();

        return GrantCheck.HasGrant(_userProvider!.CurrentUser, requiredAttributes, context.HttpContext.GetEndpoint()?.DisplayName)
           .Match(
                _ => next(context),
                i =>
                {
                    context.HttpContext.Response.StatusCode = i.StatusCode ?? 403;
                    return new ValueTask<object?>(i.Value);
                }
            );
    }
}
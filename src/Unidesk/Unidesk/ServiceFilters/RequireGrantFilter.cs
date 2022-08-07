using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Unidesk.Db.Models;
using Unidesk.Services;

namespace Unidesk.ServiceFilters;

public class RequireGrantFilter : IActionFilter
{
    private readonly IUserProvider? _userProvider;
    private readonly RequestDelegate? _next;
    
    public RequireGrantFilter(IUserProvider userProvider)
    {
        _userProvider = userProvider;
    }
    
    public RequireGrantFilter(RequestDelegate next)
    {
        _next = next;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        var requiredAttributes = context.ActionDescriptor.EndpointMetadata
            .OfType<RequireGrantAttribute>()
            .ToList();

        if (!requiredAttributes.Any())
        {
            return;
        }

        var userGrants = _userProvider!.CurrentUser?.Roles.SelectMany(i => i.Grants).ToList() ?? new List<Grant>();
        var result = HasAccess(requiredAttributes, userGrants);
        
        if (!result.Granted)
        {
            context.Result = new JsonResult(new { result.Error })
                { StatusCode = result.StatusCode };
        }
    }
    
    private static (bool Granted, string? Error, int StatusCode) HasAccess( List<RequireGrantAttribute> requireGrantAttributes, List<Grant> userGrants)
    {
        var granted = requireGrantAttributes.All(i => userGrants.Any(j => j.Id == i.Grant.Id));
        if (!granted)
        {
            var requiredAttributesStr = string.Join(", ", requireGrantAttributes.Select(i => i.Grant.Name));
            return (granted, $"You don't have permission to access this resource, required grants: {requiredAttributesStr}" , StatusCodes.Status403Forbidden);
        }
        return (granted, null, StatusCodes.Status200OK);
    }

    public void OnActionExecuted(ActionExecutedContext context) { }

    /// <summary>
    /// Invokes the middleware performing authorization.
    /// </summary>
    /// <param name="context">The <see cref="HttpContext"/>.</param>
    public async Task Invoke(HttpContext context, IUserProvider userProvider)
    {
        var endpoint = context.GetEndpoint();
        if (endpoint is null)
        {
            await _next!(context);
            return;
        }

        var requiredAttributes = endpoint.Metadata
            .OfType<RequireGrantAttribute>()
            .ToList();
        
        if (!requiredAttributes.Any())
        {
            await _next!(context);
            return;
        }
        
        var userGrants = userProvider.CurrentUser?.Roles
            .SelectMany(i => i.Grants)
            .ToList() ?? new List<Grant>();
        
        var result = HasAccess(requiredAttributes, userGrants);
        if (!result.Granted)
        {
            context.Response.StatusCode = result.StatusCode;
            await context.Response.WriteAsJsonAsync(new { result.Error });
        }
        else
        {
            await _next!(context);
        }
        
    }
}
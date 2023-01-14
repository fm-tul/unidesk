using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Unidesk.Db.Models;
using Unidesk.Dtos;
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

        if (!requiredAttributes.Any())
        {
            return;
        }

        var requiredGrants = requiredAttributes.Select(x => x.Grant).ToList();
        var userGrants = _userProvider!.CurrentUser.Grants.ToList() ?? new List<Grant>();
        var result = HasAccess(requiredGrants, userGrants);

        if (!result.Granted)
        {
            context.Result = new JsonResult(new SimpleJsonResponse
                {
                    Success = false,
                    Message = "Access denied",
                    DebugMessage = $"Access denied for user {_userProvider!.CurrentUser.Username} " +
                                   $"to {context.ActionDescriptor.DisplayName} because of missing grants: " +
                                   $"{string.Join(", ", requiredGrants.Select(i => $"{i.Name} ({i.Id}"))}",
                    Errors = new[] { new ValidationFailure("Grants", "Access denied") }
                })
                { StatusCode = result.StatusCode };
        }
    }

    public static (bool Granted, string? Error, int StatusCode) HasAccess(List<Grant> requireGrants, List<Grant> userGrants)
    {
        var granted = requireGrants.All(i => userGrants.Any(j => j.Id == i.Id));
        if (!granted)
        {
            var requiredAttributesStr = string.Join(", ", requireGrants.Select(i => i.Name));
            return (granted, $"You don't have permission to access this resource, required grants: {requiredAttributesStr}", StatusCodes.Status403Forbidden);
        }

        return (granted, null, StatusCodes.Status200OK);
    }

    public static (bool Granted, string? Error, int StatusCode) HasAccess(IEnumerable<RequireGrantAttribute> requireGrantAttributes, List<Grant> userGrants)
    {
        return HasAccess(requireGrantAttributes.Select(i => i.Grant).ToList(), userGrants);
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        // not applicable
    }
}
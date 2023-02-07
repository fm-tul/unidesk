using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using OneOf.Types;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.ServiceFilters;

namespace Unidesk.Server.ServiceFilters;

public static class GrantCheck
{
    public static OneOf<True, JsonResult> HasGrant(User? user, List<RequireGrantAttribute>? requireGrantAttributes, string? actionName = "resource")
    {
        var requiredGrants = requireGrantAttributes?.Select(x => x.Grant).ToList() ?? new List<Grant>();
        var userGrants = user?.Grants.ToList() ?? new List<Grant>();
        var result = HasAccess(requiredGrants, userGrants);

        if (!result.Granted)
        {
            return new JsonResult(new SimpleJsonResponse
                {
                    Success = false,
                    Message = "Access denied",
                    DebugMessage = $"Access denied for user {user?.Username ?? "anonymous"} " +
                                   $"to {actionName} because of missing grants: " +
                                   $"{string.Join(", ", requiredGrants.Select(i => $"{i.Name} ({i.Id}"))}",
                    Errors = new[] { new ValidationFailure("Grants", "Access denied") }
                })
                { StatusCode = result.StatusCode };
        }

        return new True();
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
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Unidesk.Db.Models;
using Unidesk.Services;

namespace Unidesk.ServiceFilters;

public class RequireGrantFilter : IActionFilter
{
    private readonly IUserProvider _userProvider;

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

        var user = _userProvider.CurrentUser;
        var userGrants = user.Roles?.SelectMany(i => i.Grants).ToList() ?? new List<Grant>();

        var granted = requiredAttributes.All(i => userGrants.Any(j => j.Id == i.Grant.Id));
        if (!granted)
        {
            var requiredAttributesStr = string.Join(", ", requiredAttributes.Select(i => i.Grant.Name));
            var msg = new
            {
                Message = $"You don't have permission to access this resource, required grants: {requiredAttributesStr}"
            };
            context.Result = new JsonResult(msg)
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}
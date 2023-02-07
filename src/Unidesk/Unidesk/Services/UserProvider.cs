using FluentValidation;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Security;

namespace Unidesk.Services;

public class UserProvider : IUserProvider
{
    public User CurrentUser { get; set; } = null!;
    public Guid CurrentUserId => CurrentUser.Id;

    public bool HasGrant(Grants grant) => CurrentUser.HasGrant(grant);
    public void ValidateAndThrow(Action<UserRoleDto> validateAndThrow, UserRoleDto dto)
    {
        try
        {
            validateAndThrow(dto);
        }
        catch (ValidationException e)
        {
            var allIsWarning = e.Errors.All(x => x.Severity == Severity.Warning);
            var userHasGrant = HasGrant(Grants.Validation_Ignore_Warnings);
            if (allIsWarning && userHasGrant)
            {
                return;
            }

            throw;
        }
    }
    
    
}
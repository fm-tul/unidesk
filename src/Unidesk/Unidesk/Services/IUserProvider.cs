using System.Diagnostics.CodeAnalysis;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Security;

namespace Unidesk.Services;

public interface IUserProvider
{
    [NotNull]
    public User? CurrentUser { get; set; }
    
    public Guid CurrentUserId => CurrentUser.Id;

    public bool HasGrant(Grants grant) => CurrentUser.HasGrant(grant);
    public bool HasSomeOfGrants(params Grants[] grants) => grants.Any(HasGrant);
    void ValidateAndThrow(Action<UserRoleDto> validateAndThrow, UserRoleDto dto);
}
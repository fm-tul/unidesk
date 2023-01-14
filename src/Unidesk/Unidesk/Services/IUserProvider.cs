using System.Diagnostics.CodeAnalysis;
using Unidesk.Db.Models;
using Unidesk.Dtos;

namespace Unidesk.Services;

public interface IUserProvider
{
    [NotNull]
    public User? CurrentUser { get; set; }
    
    public Guid CurrentUserId => CurrentUser.Id;

    public bool HasGrant(Grant grantId) => CurrentUser.HasGrant(grantId.Name);
    public bool HasGrant(string grantName) => CurrentUser.HasGrant(grantName);
    void ValidateAndThrow(Action<UserRoleDto> validateAndThrow, UserRoleDto dto);
}
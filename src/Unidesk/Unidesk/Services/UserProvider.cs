using Unidesk.Db.Models;

namespace Unidesk.Services;

public class UserProvider : IUserProvider
{
    public User CurrentUser { get; set; } = null!;
    public Guid CurrentUserId => CurrentUser.Id;

    public bool HasGrant(Grant grantId) => CurrentUser.HasGrant(grantId.Name);
    public bool HasGrant(string grantName) => CurrentUser.HasGrant(grantName);
}
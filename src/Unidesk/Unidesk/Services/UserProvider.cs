using Unidesk.Db.Models;

namespace Unidesk.Services;

public class UserProvider : IUserProvider
{
    public User CurrentUser { get; set; } = null!;
}
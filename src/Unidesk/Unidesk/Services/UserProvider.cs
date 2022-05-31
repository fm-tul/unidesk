using Unidesk.Db.Models;

namespace Unidesk.Services;

public class UserProvider
{
    public readonly User? CurrentUser = new User
    {
        Email = "foo@bar.com"
    };
}
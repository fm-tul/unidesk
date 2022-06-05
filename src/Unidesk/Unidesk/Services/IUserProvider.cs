using Unidesk.Db.Models;

namespace Unidesk.Services;

public interface IUserProvider
{
    public User? CurrentUser { get; set; }
}
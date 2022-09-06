using Unidesk.Db.Models;

namespace Unidesk.Dtos.Requests;

public class UserFilter : BasicFilter
{
    public List<UserFunction> UserFunctions { get; set; } = new List<UserFunction>();
}
using Unidesk.Db.Models;

namespace Unidesk.Dtos.Requests;

public class UserFilter : BasicFilter
{
    public List<UserFunction> UserFunctions { get; set; } = new();
    public bool? LinkedWithStag { get; set; }
    
    public bool? IncludeHidden { get; set; }
}
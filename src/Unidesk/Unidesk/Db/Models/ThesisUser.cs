using Unidesk.Server;

namespace Unidesk.Db.Models;

public class ThesisUser
{
    public User User { get; set; }
    public Guid UserId { get; set; }
    
    [IgnoreMapping]
    public Thesis Thesis { get; set; }
    public Guid ThesisId { get; set; }
    
    public UserFunction Function { get; set; }
}
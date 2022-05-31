using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class UserRole : IdEntity
{
    public string Name { get; set; }

    public string Description { get; set; }
    // public Grant[] Grants { get; set; }
}
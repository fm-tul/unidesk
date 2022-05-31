using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class Department : TrackedEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
}
using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class Department : IdEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
}
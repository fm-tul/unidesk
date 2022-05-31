using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class Faculty : IdEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
}
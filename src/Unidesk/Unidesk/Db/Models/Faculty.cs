using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class Faculty : TrackedEntity
{
    public string Name { get; set; }
    public string? Description { get; set; }
}
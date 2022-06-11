using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class Faculty : TrackedEntity
{
    public string NameEng { get; set; }
    public string NameCze { get; set; }
    
    public string Code { get; set; }
    
    public string? DescriptionEng { get; set; }
    public string? DescriptionCze { get; set; }
}
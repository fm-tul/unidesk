using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class Keyword : TrackedEntity
{
    public string Value { get; set; }
    public string Locale { get; set; }
    
    public List<KeywordThesis> KeywordThesis { get; set; } = new List<KeywordThesis>();
}
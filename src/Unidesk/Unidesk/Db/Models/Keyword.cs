using System.ComponentModel.DataAnnotations.Schema;
using Unidesk.Db.Core;
using Unidesk.Server;

namespace Unidesk.Db.Models;

public class Keyword : TrackedEntity
{
    public string Value { get; set; }
    public string Locale { get; set; }
    
    [IgnoreMapping]
    public List<KeywordThesis> KeywordThesis { get; set; } = new List<KeywordThesis>();
    
    [NotMapped]
    public int Used => KeywordThesis.Count;
}
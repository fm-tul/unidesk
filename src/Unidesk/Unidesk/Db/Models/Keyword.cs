using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class Keyword : IdEntity
{
    public string Value { get; set; }
    public string Locale { get; set; }
}
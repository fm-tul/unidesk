using System.Text.Json.Serialization;
using Unidesk.Client;

namespace Unidesk.Db.Models;

[Flags]
[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(Name = "UserFunction", ForType = typeof(UserFunction), GenerateAggregation = true, GenerateMap = true)]
public enum UserFunction
{
    [MultiLang("None", "Žádná")]
    None = 0,
    
    [MultiLang("Guest", "Host")]
    Guest = 1,
    
    [MultiLang("Author", "Autor")]
    Author = 2,
    
    [MultiLang("Teacher", "Učitel")]
    Teacher = 4,
    
    [MultiLang("Supervisor", "Vedoucí")]
    Supervisor = 8,
    
    [MultiLang("Opponent", "Oponent")]
    Opponent = 16,
    
    [MultiLang("External", "Externista")]
    External = 32,
}

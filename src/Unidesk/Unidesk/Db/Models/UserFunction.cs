using System.Text.Json.Serialization;

namespace Unidesk.Db.Models;

[Flags]
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum UserFunction
{
    None = 0,
    Guest = 1,
    Author = 2,
    Teacher = 4,
    Admin = 8,
    Supervisor = 16,
    Opponent = 32,
}

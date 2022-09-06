using System.Text.Json.Serialization;

namespace Unidesk.Db.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ThesisReportRelation
{
    Supervisor = 0,
    Opponent = 1,
}
using System.Text.Json.Serialization;

namespace Unidesk.Dtos.Requests;

public class KeywordFilter : BasicFilter
{
    public KeywordUsedCount? UsedCount { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum KeywordUsedCount
{
    MoreThan1,
    MoreThan5,
    MoreThan10,
}
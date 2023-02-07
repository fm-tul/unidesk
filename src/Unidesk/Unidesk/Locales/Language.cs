using System.Text.Json.Serialization;

namespace Unidesk.Locales;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Language
{
    ToBeDetermined = 0,
    Czech = 1,
    English = 2,
}
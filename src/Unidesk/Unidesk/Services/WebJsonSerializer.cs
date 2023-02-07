using System.Text.Json;

namespace Unidesk.Services;

public static class WebJsonSerializer
{
    private static readonly JsonSerializerOptions _options = new(JsonSerializerDefaults.Web);
    public static string Serialize<TValue>(TValue obj)
    {
        return JsonSerializer.Serialize(obj, _options);
    }
    
    public static TValue? Deserialize<TValue>(string json)
    {
        return JsonSerializer.Deserialize<TValue>(json, _options);
    }
}
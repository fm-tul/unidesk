using System.Text.Json;
using Unidesk.Server.Converters;

namespace Unidesk.Services;

public static class WebJsonSerializer
{
    private static readonly JsonSerializerOptions _options = GetOptions();
    public static string Serialize<TValue>(TValue obj)
    {
        return JsonSerializer.Serialize(obj, _options);
    }
    
    public static TValue? Deserialize<TValue>(string json)
    {
        return JsonSerializer.Deserialize<TValue>(json, _options);
    }

    private static JsonSerializerOptions GetOptions()
    {
        var options = new JsonSerializerOptions(JsonSerializerDefaults.Web);
        options.Converters.Add(new DateOnlyJsonConverter());
        return options;
    }
}
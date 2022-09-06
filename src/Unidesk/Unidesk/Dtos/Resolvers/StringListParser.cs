using Newtonsoft.Json;

namespace Unidesk.Dtos.Resolvers;

public static class StringListParser
{
        public static List<string> Parse(string? text)
        {
            if (string.IsNullOrEmpty(text))
            {
                return new List<string>();
            }
            return JsonConvert.DeserializeObject<List<string>>(text) ?? new List<string>();
        }

        public static string? Serialize(List<string> value)
        {
            return JsonConvert.SerializeObject(value);
        }
}
using Unidesk.Server.Locales;

namespace Unidesk.Client;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Enum, AllowMultiple = true)]
public class GenerateModelAttribute : Attribute
{
    public string? Name { get; set; }

    public Type ForType { get; set; }

    public bool GenerateAggreation { get; set; }
}

[AttributeUsage(AttributeTargets.Field | AttributeTargets.Property, AllowMultiple = true)]
public class MultiLangAttribute : Attribute
{
    public string Locale { get; set; }
    public string Value { get; set; }

    public string CzeValue { get; set; }
    public string EngValue { get; set; }

    public MultiLangAttribute(LocaleType locale, string value)
    {
        Locale = locale.ToString()
            .ToLower();
        Value = value;
    }

    public MultiLangAttribute(string eng, string cze)
    {
        EngValue = eng;
        CzeValue = cze;
    }

    public IEnumerable<KeyValuePair<string, object>> GetValues()
    {
        if (!string.IsNullOrEmpty(Value))
        {
            yield return new KeyValuePair<string, object>(Locale, Value);
        }

        if (!string.IsNullOrEmpty(CzeValue))
        {
            yield return new KeyValuePair<string, object>(
                LocaleType.CZE.ToString()
                    .ToLower(), CzeValue);
        }

        if (!string.IsNullOrEmpty(EngValue))
        {
            yield return new KeyValuePair<string, object>(
                LocaleType.ENG.ToString()
                    .ToLower(), EngValue);
        }
    }
}

public static class MultiLangAttributeExtensions
{
    public static Dictionary<string, object> Combine(this IEnumerable<MultiLangAttribute> attributes)
    {
        var result = attributes.SelectMany(a => a.GetValues())
            .ToDictionary(k => k.Key, v => v.Value);
        return result;
    }
}
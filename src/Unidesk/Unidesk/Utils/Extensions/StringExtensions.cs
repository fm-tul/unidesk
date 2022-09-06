using System.Diagnostics.CodeAnalysis;

namespace Unidesk.Utils.Extensions;

public static class StringExtensions
{
    public static string? Value(this string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }
    
    public static bool IsNotNullOrEmpty([NotNullWhen(true)] this string? value)
    {
        return !string.IsNullOrWhiteSpace(value);
    }

    public static string? ValidEmailOrDefault(this string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return null;
        }

        if (email.StartsWith("@") || !email.Contains("@"))
        {
            return null;
        }
        
        return email.Value();
    }
    
    public static bool IsSame(this string? value, string? other)
    {
        return string.Equals(value, other, StringComparison.InvariantCultureIgnoreCase);
    }
    
    public static bool ContainsString(this IEnumerable<string> items, string? value)
    {
        return items.Any(item => string.Equals(value, item, StringComparison.InvariantCultureIgnoreCase));
    }
    
    public static string RemoveWeirdCharacters(this string value)
    {
        return value
            .Replace("\\", "")
            .Replace("\n", "")
            .Replace("~", "")
            .Replace("\r", "");
    }
}
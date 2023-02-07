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
    
    public static bool IsNullOrEmpty([NotNullWhen(false)] this string? value)
    {
        return string.IsNullOrWhiteSpace(value);
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

    public static string RemoveNumbers(this string value)
    {
        return new string(value.Where(c => !char.IsDigit(c)).ToArray());
    }

    public static string UsernameFromEmail(this string email)
    {
        return email.Split("@")[0];
    }

    public static string? FirstnameFromEmail(this string email)
    {
        var username = email.UsernameFromEmail();
        var parts = username.Split(".");
        return parts.Length >= 2 ? parts[0].RemoveNumbers().Capitalize() : null;
    }

    public static string? LastnameFromEmail(this string email)
    {
        var username = email.UsernameFromEmail();
        var parts = username.Split(".");
        return parts.Length >= 2 ? parts[1].RemoveNumbers().Capitalize() : null;
    }

    public static string Capitalize(this string value)
    {
        return value.Length switch
        {
            0 => value,
            1 => value.ToUpper(),
            _ => string.Concat(value[..1].ToUpper(), value[1..]),
        };
    }

    public static string SafeSubstring(this string? value, int length = 160)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        if (value.Length <= length)
        {
            return value;
        }
        
        // If the string is longer than the length, truncate it to the length and add an ellipsis
        // to the end of the string. we need to find the last space before the length and truncate
        // there so we don't cut off a word.
        
        var lastSpace = value.LastIndexOf(' ', length);
        return lastSpace > 0 ? $"{value[..lastSpace]} …" : $"{value[..length]} …";
    }
}
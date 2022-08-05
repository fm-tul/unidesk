namespace Unidesk.Utils.Extensions;

public static class StringExtensions
{
    public static string? Value(this string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
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
}
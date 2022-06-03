namespace Unidesk.Extensions;

public static class StringExtensions
{
    public static string? Value(this string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }
}
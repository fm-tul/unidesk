namespace Unidesk.Utils.Extensions;

public static class EnumExtenstions
{
    public static bool In<T>(this T value, params T[] values) where T : Enum
    {
        return values.Contains(value);
    }
}
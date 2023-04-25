using Unidesk.Db.Models;

namespace Unidesk.Utils.Extensions;

public static class EnumExtensions
{
    public static bool In<T>(this T value, params T[] values) where T : Enum
    {
        return values.Contains(value);
    }
    
    public static bool NotIn<T>(this T value, params T[] values) where T : Enum
    {
        return !values.Contains(value);
    }
}
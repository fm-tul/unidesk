using Unidesk.Client;
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
    
    public static string GetDescription<T>(this T value) where T : Enum
    {
        var fieldInfo = value.GetType().GetField(value.ToString());
        var descriptionAttributes = fieldInfo?.GetCustomAttributes(typeof(MultiLangAttribute), false) as MultiLangAttribute[];
        return descriptionAttributes?.Length > 0 ? descriptionAttributes[0].EngValue : value.ToString();
    }
}
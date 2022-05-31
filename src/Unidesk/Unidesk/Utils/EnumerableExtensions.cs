namespace Unidesk.Utils;

public static class EnumerableExtensions
{
    public static IEnumerable<T> ForEach<T>(this IEnumerable<T> items, Action<T> func)
    {
        foreach (var item in items)
        {
            func(item);
            yield return item;
        }
    }
}
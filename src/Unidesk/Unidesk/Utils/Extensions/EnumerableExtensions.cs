namespace Unidesk.Utils.Extensions;

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

    public static (List<T> Same, List<T> ToBeAdded, List<T> ToBeDeleted) Synchronize<T>(this List<T> items, List<T> other, Func<T, T, bool> comparer)
    {
        var toBeAdded = new List<T>();
        var toBeDeleted = new List<T>();
        var same = new List<T>();

        foreach (var item in items)
        {
            if (other.Any(x => comparer(item, x)))
            {
                same.Add(item);
            }
            else
            {
                toBeDeleted.Add(item);
            }
        }

        foreach (var item in other)
        {
            if (!items.Any(x => comparer(item, x)))
            {
                toBeAdded.Add(item);
            }
        }

        return (same, toBeAdded, toBeDeleted);
    }
}
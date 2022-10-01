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

    public static (List<T> Same, List<T> SameNew, List<T> ToBeAdded, List<T> ToBeDeleted) Synchronize<T>(this List<T> items, List<T> other, Func<T, T, bool> comparer)
    {
        var toBeAdded = new List<T>();
        var toBeDeleted = new List<T>();
        var same = new List<T>();
        var sameNew = new List<T>();

        foreach (var item in items)
        {
            var match = other.FirstOrDefault(x => comparer(item, x));
            if (match is not null)
            {
                same.Add(item);
                sameNew.Add(match);
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

        return (same, sameNew, toBeAdded, toBeDeleted);
    }
    
    public static (List<T> Same, List<T> SameNew, List<T> ToBeAdded, List<T> ToBeDeleted) SynchronizeWithAction<T>(this List<T> items, List<T> other, Func<T, T, bool> comparer, Action<T, T> action)
    {
        var (same, sameNew, toBeAdded, toBeDeleted) = items.Synchronize(other, comparer);
        if (same.Count != sameNew.Count)
        {
            throw new Exception("Same and SameNew lists must be the same length");
        }
        
        for (var i = 0; i < same.Count; i++)
        {
            action(same[i], sameNew[i]);
        }
        
        return (same, sameNew, toBeAdded, toBeDeleted);
    }
}
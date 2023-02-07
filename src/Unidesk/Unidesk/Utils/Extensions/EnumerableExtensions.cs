using Unidesk.Db.Core;

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
    
    /// <summary>
    /// check whether the collection contains the specified items optionally (in any order) but no other items
    ///
    /// we are comparing the arrays, require 'values' to be a subset of 'items' and that 'items' does not contain any other items
    ///
    /// </summary>
    /// <param name="items"></param>
    /// <param name="values"></param>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    public static bool ContainsOnly<T>(this List<T> items, params T[] values)
    {
        return items.All(values.Contains);
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
    
    public static (List<T> Same, List<T> SameNew, List<T> ToBeAdded, List<T> ToBeDeleted) SynchronizeWithAction<T>(this List<T> items, List<T> other, Func<T, T, bool> comparer, Action<T, T> updateAction)
    {
        var (same, sameNew, toBeAdded, toBeDeleted) = items.Synchronize(other, comparer);
        if (same.Count != sameNew.Count)
        {
            throw new Exception("Same and SameNew lists must be the same length");
        }
        
        for (var i = 0; i < same.Count; i++)
        {
            updateAction(same[i], sameNew[i]);
        }
        
        return (same, sameNew, toBeAdded, toBeDeleted);
    }
    
    public static (List<T> items, List<T> toBeAdded, List<T> toBeDeleted) SynchronizeCollection<T>(this List<T> items, List<T> other, Func<T, T, bool> comparer)
    {
        var (_, _, toBeAdded, toBeDeleted) = items.Synchronize(other, comparer);
        items.AddRange(toBeAdded);
        items.RemoveAll(x => toBeDeleted.Contains(x));
        return (items, toBeAdded, toBeDeleted);
    }
    
    public static (List<T> items, List<T> toBeAdded, List<T> toBeDeleted) SynchronizeCollection<T>(this List<T> items, List<T> other)
    where T: IdEntity
    {
        var (_, _, toBeAdded, toBeDeleted) = items.Synchronize(other, IdEntity.Compare);
        items.AddRange(toBeAdded);
        items.RemoveAll(x => toBeDeleted.Contains(x));
        return (items, toBeAdded, toBeDeleted);
    }
    
    
    public static void HandleCount<T>(this List<T> items, Action<T>? onSingleItem = null, Action<IEnumerable<T>>? onMultipleItems = null, Action? onNoItems = null)
    {
        switch (items.Count)
        {
            case 1:
                onSingleItem?.Invoke(items[0]);
                break;
            case > 1:
                onMultipleItems?.Invoke(items);
                break;
            default:
                onNoItems?.Invoke();
                break;
        }
    }
    
    public static Task HandleCountAsync<T>(this List<T> items, Func<T, Task>? onSingleItem = null, Func<IEnumerable<T>, Task>? onMultipleItems = null, Func<Task>? onNoItems = null)
    {
        switch (items.Count)
        {
            case 1:
                return onSingleItem?.Invoke(items[0]) ?? Task.CompletedTask;
            case > 1:
                return onMultipleItems?.Invoke(items) ?? Task.CompletedTask;
            default:
                return onNoItems?.Invoke() ?? Task.CompletedTask;
        }
    }
}
namespace Unidesk.Utils;

public static class MathUtils
{
    public static IEnumerable<(T a, T b)> Combinations<T>(List<T> items)
    {
        // combinations of 2 items from a list of n items
        for (int i = 0; i < items.Count; i++)
        {
            for (int j = i + 1; j < items.Count; j++)
            {
                yield return (items[i], items[j]);
            }
        }
    }
}
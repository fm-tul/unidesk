using System.Collections;
using System.Diagnostics;

namespace Unidesk.Utils;

/// <summary>
/// Simple class recording the results of a some operation
/// How many types were processed of certain type
/// </summary>
public struct OperationInfoEntry
{
    public readonly Type Type;
    public readonly int Rows;
    public TimeSpan Duration;

    public OperationInfoEntry(Type type, int rows, TimeSpan duration)
    {
        Type = type;
        Rows = rows;
        Duration = duration;
    }
}

public class OperationInfo
{
    private readonly string OperationName;
    private List<OperationInfoEntry> _entries { get; set; } = new List<OperationInfoEntry>();
    public int TotalRows => _entries.Sum(x => x.Rows);
    public TimeSpan TotalDuration => _entries.Aggregate(TimeSpan.Zero, (acc, x) => acc + x.Duration);

    private readonly string _separator = "  + ";
    private Stopwatch _stopwatch = Stopwatch.StartNew();

    public OperationInfo(string operationName = "")
    {
        OperationName = operationName;
    }

    /// <summary>
    /// Generates a string with the info about the operation that was performed
    /// </summary>
    public string DebugMessage()
    {
        if (string.IsNullOrEmpty(OperationName))
        {
            return string.Join(", ", _entries.Select(x => $"{x.Type.Name}=[{x.Rows} in {x.Duration.TotalMilliseconds} ms]"));
        }

        var info = string.Join("\n", _entries.Select(x => $"{_separator}{x.Rows,4} {x.Type.Name} in {x.Duration.TotalMilliseconds} ms"));
        return $"{OperationName}:\n{info}\n  = {TotalRows,4} total rows in {TotalDuration.TotalMilliseconds} ms";
    }

    override public string ToString()
    {
        return DebugMessage();
    }

    public static OperationInfo operator +(OperationInfo info, object items)
    {
        if (items == null)
        {
            return info;
        }
        info.Record(items);
        return info;
    }


    public T Record<T>(T items) {
        var type = items.GetType().GetGenericArguments().LastOrDefault()
                    ?? items.GetType().GetElementType();

        if (type == null)
        {
            return items;
        }

        if (items is ICollection collection)
        {
            this.Add(type, collection.Count);
        }
        return items;
    }

    public void Add<T>(int count)
    {
        Add(typeof(T), count);
    }
    private void Add(Type type, int count)
    {
        _entries.Add(new OperationInfoEntry(type, count, _stopwatch.Elapsed));
        _stopwatch.Restart();
    }
}
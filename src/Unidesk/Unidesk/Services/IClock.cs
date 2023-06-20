using Unidesk.Db.Core;

namespace Unidesk.Services;

public interface IClock
{
    DateTime Now { get; }
    DateTime UtcNow { get; }
}

public static class ClockExtensions
{
    public static bool IsOverWeeksOld<T>(this IClock clock, T item, int weeks = 1) where T : TrackedEntity
    {
        var diff = clock.UtcNow - item.Created;
        return diff > TimeSpan.FromDays(7 * weeks);
    }
}
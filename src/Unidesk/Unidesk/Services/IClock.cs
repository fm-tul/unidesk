namespace Unidesk.Services;

public interface IClock
{
    DateTime Now { get; }
    DateTime UtcNow { get; }
}
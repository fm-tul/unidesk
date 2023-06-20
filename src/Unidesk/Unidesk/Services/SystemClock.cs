namespace Unidesk.Services;

public class SystemClock : IClock
{
    public DateTime Now => DateTime.UtcNow;
    public DateTime UtcNow => DateTime.UtcNow;
}
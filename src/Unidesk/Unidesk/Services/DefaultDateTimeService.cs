namespace Unidesk.Services;


public interface IDateTimeService
{
    DateTime Now { get; }
}

public class DefaultDateTimeService : IDateTimeService
{
    public DateTime Now => DateTime.UtcNow;
}

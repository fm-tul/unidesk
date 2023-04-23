using Serilog.Context;

namespace Unidesk.Logging;

public class LogUserNameMiddleware
{
    private readonly RequestDelegate next;

    public LogUserNameMiddleware(RequestDelegate next)
    {
        this.next = next;
    }

    public Task Invoke(HttpContext context)
    {
        LogContext.PushProperty("UserName", context.User.Identity?.Name ?? "[anon]");
        return next(context);
    }
}
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Newtonsoft.Json;

namespace Unidesk.Server;

public class JsonExceptionMiddleware
{
    private readonly IWebHostEnvironment _appEnvironment;


    public JsonExceptionMiddleware(IWebHostEnvironment appEnvironment)
    {
        _appEnvironment = appEnvironment;
    }
    
    public async Task Invoke(HttpContext context)
    {
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var ex = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        if (ex == null)
        {
            return;
        }

        var error = new 
        {
            message = ex.Message
        };

        context.Response.ContentType = "application/json";

        using (var writer = new StreamWriter(context.Response.Body))
        {
            new JsonSerializer().Serialize(writer, error);
            await writer.FlushAsync().ConfigureAwait(false);
        }
    }
}
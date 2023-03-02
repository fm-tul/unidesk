using System.Net.Mime;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Unidesk.Dtos;

namespace Unidesk.Exceptions;

public static class UnideskExceptionHandler
{
    public static async Task HandleException(HttpContext context)
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = MediaTypeNames.Application.Json;
        var exception = context.Features.Get<IExceptionHandlerPathFeature>();
        var errorMessage = exception?.Error?.InnerException?.Message ??
                           exception?.Error?.Message ?? "An error occurred";
        
        var data = new SimpleJsonResponse
        {
            Success = false,
            Message = errorMessage,
            StackTrace = exception?.Error?.StackTrace?.Split('\n') ?? Enumerable.Empty<string>(),
            DebugMessage = errorMessage,
        };

        if (exception?.Error is DbUpdateException)
        {
            data.Message = "Database Exception";
            data.DebugMessage = exception.Error.InnerException?.Message ?? exception.Error.Message;
        }
        else if (exception?.Error is FluentValidation.ValidationException fluentError)
        {
            data.Message = "Validation Failed";
            data.DebugMessage = exception.Error.Message;
            data.Errors = fluentError.Errors;
        }
        else if (exception?.Error is UnideskException unideskException)
        {
            data.Message = unideskException.ErrorCategory;
            data.DebugMessage = unideskException.Message;
        }

        await context.Response.WriteAsJsonAsync(data);
    }
}
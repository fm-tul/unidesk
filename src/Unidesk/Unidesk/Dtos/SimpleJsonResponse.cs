using FluentValidation.Results;

namespace Unidesk.Dtos;

public class SimpleJsonResponse : DtoBase
{
    public bool Success { get; set; } = true;
    public string Message { get; set; }

    public IEnumerable<string> StackTrace { get; set; } = Enumerable.Empty<string>();
    public string? DebugMessage { get; set; }
    public IEnumerable<ValidationFailure> Errors { get; set; }
}
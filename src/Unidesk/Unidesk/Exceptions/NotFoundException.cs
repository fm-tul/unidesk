using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;

namespace Unidesk.Exceptions;
public class NotFoundException : UnideskException
{
    public NotFoundException() { }
    public NotFoundException(string? message) : base(message) { }
    public NotFoundException(string? message, Exception? innerException) : base(message, innerException) { }

    public override string ErrorCategory => "Not Found";
    
    public static void ThrowIfNullOrEmpty<T>([NotNull] T? argument, [CallerArgumentExpression("argument")] string? paramName = null)
    {
        if (argument is null)
        {
            throw new NotFoundException("The requested resource was not found.");
        }
    }
}
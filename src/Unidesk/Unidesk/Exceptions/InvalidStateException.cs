using System.Runtime.CompilerServices;
using JetBrains.Annotations;

namespace Unidesk.Exceptions;
public class InvalidStateException : UnideskException
{
    public InvalidStateException() { }
    public InvalidStateException(string? message) : base(message) { }
    public InvalidStateException(string? message, Exception? innerException) : base(message, innerException) { }

    public override string ErrorCategory => "Invalid State";
    
    [ContractAnnotation("condition: false => halt")]
    public static void ThrowIf(bool condition, string message)
    {
        if (condition)
        {
            throw new InvalidStateException(message);
        }
    }
}
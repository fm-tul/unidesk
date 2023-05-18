using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using JetBrains.Annotations;

namespace Unidesk.Exceptions;
public class LogicValidationException : UnideskException
{
    public LogicValidationException() { }
    public LogicValidationException(string? message) : base(message) { }
    public LogicValidationException(string? message, Exception? innerException) : base(message, innerException) { }

    public override string ErrorCategory => "Validation error";
    
    [ContractAnnotation("b: false => halt")]
    public static void ThrowIf(bool b, string error)
    {
        if (b)
        {
            throw new LogicValidationException(error);
        }
    }
}
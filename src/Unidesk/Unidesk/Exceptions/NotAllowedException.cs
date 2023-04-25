using JetBrains.Annotations;

namespace Unidesk.Exceptions;

public class NotAllowedException : UnideskException
{
    public NotAllowedException() { }
    public NotAllowedException(string? message) : base(message) { }
    public NotAllowedException(string? message, Exception? innerException) : base(message, innerException) { }

    public override string ErrorCategory => "Operation not allowed";

    [ContractAnnotation("b: false => halt")]
    public static void ThrowIf(bool b, string error)
    {
        if (b)
        {
            throw new NotAllowedException(error);
        }
    }
}
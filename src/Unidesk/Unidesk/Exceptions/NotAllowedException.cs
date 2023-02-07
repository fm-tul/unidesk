namespace Unidesk.Exceptions;

public class NotAllowedException : UnideskException
{
    public NotAllowedException() { }
    public NotAllowedException(string? message) : base(message) { }
    public NotAllowedException(string? message, Exception? innerException) : base(message, innerException) { }

    public override string ErrorCategory => "Operation not allowed";
}
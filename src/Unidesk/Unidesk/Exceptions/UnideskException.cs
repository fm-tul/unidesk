namespace Unidesk.Exceptions;

public abstract class UnideskException : Exception
{
    public abstract string ErrorCategory { get; }
    protected UnideskException() { }
    protected UnideskException(string? message) : base(message) { }
    protected UnideskException(string? message, Exception? innerException) : base(message, innerException) { }
}
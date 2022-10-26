namespace Unidesk.Validations;

public interface IValidatedEntity<T>
{
    public void ValidateAndThrow(T item);
}
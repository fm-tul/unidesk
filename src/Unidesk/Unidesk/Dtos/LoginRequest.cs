namespace Unidesk.Dtos;

public class LoginRequest : ILoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

public interface ILoginRequest
{
    string Username { get; set; }
}
namespace Unidesk.Dtos;

public class LoginRequest : ILoginRequest
{
    public string Eppn { get; set; }
    public string Password { get; set; }
}

public interface ILoginRequest
{
    string Eppn { get; set; }
}
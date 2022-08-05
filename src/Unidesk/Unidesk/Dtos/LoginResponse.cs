namespace Unidesk.Dtos;

public class LoginResponse
{
    public bool IsAuthenticated { get; set; }
    public string Message { get; set; }
    public UserDto User { get; set; }
}
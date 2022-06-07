namespace Unidesk.Dtos;

public class LoginShibboRequest : ILoginRequest
{
    public string Username { get; set; }
    
    
    public float Time { get; set; }
    public int Rnd { get; set; }
}
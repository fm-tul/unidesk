namespace Unidesk.Dtos;

public class LoginRequest : ILoginRequest
{
    public string Eppn { get; set; }
    public string? PasswordBase64 { get; set; }
    
    public string? RecoveryToken { get; set; }
}

public class RegisterRequest
{
    public string Eppn { get; set; }
    public string? PasswordBase64 { get; set; }
    public string? PasswordBase64Repeat { get; set; }
}

public class ResetPasswordRequest {
    public string Eppn { get; set; }
}

public interface ILoginRequest
{
    string Eppn { get; set; }
}
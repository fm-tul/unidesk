namespace Unidesk.Services.Email;

public class EmailOptions
{
    public required string Server { get; set; } 
    public required int Port { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required bool UseSsl { get; set; }
    
    
    public required string From { get; set; }
    public string? RedirectAllEmailsTo { get; set; }
    
    public int MaxAttempts { get; set; } = 3;
}
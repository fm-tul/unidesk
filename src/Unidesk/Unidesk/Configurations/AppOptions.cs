using Unidesk.Services.Email;

namespace Unidesk.Configurations;

public class AppOptions
{
    public bool AllowRegistrations { get; set; }
    public bool AllowLocalAccounts { get; set; }
    
    // Security
    public string AesKey { get; set; } = null!;
    public string AesIV { get; set; } = null!;
    
    // stag 
    public string StagUsername { get; set; } = null!;
    public string StagPassword { get; set; } = null!;
    
    // email options
    public EmailOptions EmailOptions { get; set; } = null!;
}
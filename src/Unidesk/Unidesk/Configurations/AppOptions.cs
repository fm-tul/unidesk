namespace Unidesk.Configurations;

public class AppOptions
{
    public bool AllowRegistrations { get; set; }
    public bool AllowLocalAccounts { get; set; }
    
    // Security
    public string AesKey { get; set; } = null!;
    public string AesIV { get; set; } = null!;
}
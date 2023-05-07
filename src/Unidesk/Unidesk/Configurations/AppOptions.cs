using System.Text.Json.Serialization;
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
    
    public string LianeLoginUrl { get; set; } = null!;
    
    // email options
    public EmailOptions EmailOptions { get; set; } = null!;
    
    public EnvironmentType Environment { get; set; }

    public string LogDir { get; set; } = ".";
    public string ServerUrl { get; set; } = "https://temata.fm.tul.cz";
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum EnvironmentType
{
    Local = 0,
    Dev,
    Test,
    Prod,
}
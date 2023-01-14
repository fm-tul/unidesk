using System.Text.Json.Serialization;

namespace Unidesk.Dtos;

public class LoginShibboRequest : ILoginRequest
{
    [JsonPropertyName("eppn")]
    public string Eppn { get; set; }
    
    [JsonPropertyName("affiliation")]
    public string Affiliation { get; set; }
    
    
    public float Time { get; set; }
    public int Rnd { get; set; }
}
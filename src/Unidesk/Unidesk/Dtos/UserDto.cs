using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Unidesk.Db.Models;
using Unidesk.Server;

namespace Unidesk.Dtos;

public class UserDto : UserSimpleDto
{
    [JsonIgnore]
    public List<Grant> Grants { get; set; } = new();
    
    [Required]
    public List<Guid> GrantIds => Grants.Select(g => g.Id).ToList();
    
    public int ThesisCount { get; set; }
    
    [Required]
    public UserFunction UserFunction { get; set; }
    
    
    [IgnoreMapping]
    public double? SupervisionsRatio { get; set; }
    
    [IgnoreMapping]
    public int? SupervisionsTotal { get; set; }
    
    [Required]
    public List<UserInTeamDto> UserInTeams { get; set; } = new();
    
    [Required]
    public List<TeamSimpleDto> Teams { get; set; } = new();
}
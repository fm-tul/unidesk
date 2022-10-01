using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Unidesk.Client;
using Unidesk.Db.Core;
using Unidesk.Server;

namespace Unidesk.Db.Models;

public class Team : TrackedEntity
{

    [NotMapped]
    public List<User> Users => UserInTeams.Select(x => x.User).ToList();
    
    [IgnoreMapping]
    public List<UserInTeam> UserInTeams { get; set; } = new();
    

    public string Name { get; set; }
    public string Description { get; set; }
    public string? Avatar { get; set; }
    public TeamType Type { get; set; }
}

[Flags]
[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(ForType = typeof(TeamType), GenerateAggreation = true, Name = "TeamType")]
public enum TeamType
{
    Unknown = 0,
    Team,
    Organization,
}


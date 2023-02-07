using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Unidesk.Client;
using Unidesk.Db.Core;
using Unidesk.Dtos.ReadOnly;
using Unidesk.Server;

namespace Unidesk.Db.Models;

public class Team : TrackedEntity
{
    [NotMapped]
    public List<TeamUserLookupDto> Users { get; set; } = new();

    [IgnoreMapping]
    public List<UserInTeam> UserInTeams { get; set; } = new();


    public string Name { get; set; }
    public string Description { get; set; }

    public string? Email { get; set; }
    public byte[] Avatar { get; set; } = Array.Empty<byte>();
    public TeamType Type { get; set; }
}

[Flags]
[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(ForType = typeof(TeamType), GenerateAggregation = true, Name = "TeamType")]
public enum TeamType
{
    Unknown = 0,
    Team,
    Organization,
}
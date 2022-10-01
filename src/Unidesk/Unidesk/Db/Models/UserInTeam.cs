using System.Text.Json.Serialization;
using Unidesk.Client;
using Unidesk.Server;

namespace Unidesk.Db.Models;

public class UserInTeam
{
    public Guid UserId { get; set; }
    public User User { get; set; }

    public Team Team { get; set; }
    public Guid TeamId { get; set; }

    public UserInTeamStatus Status { get; set; }
    
    public TeamRole Role { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(ForType = typeof(UserInTeamStatus), GenerateAggreation = true, Name = "UserInTeamStatus")]
public enum UserInTeamStatus
{
    [MultiLang("Unknown", "Neznámý")]
    Unknown = 0,
    [MultiLang("Accepted", "Schválený")]
    Accepted,
    [MultiLang("Declined", "Odmítnutý")]
    Declined,
    [MultiLang("Removed", "Odstraněný")]
    Removed,
    [MultiLang("Pending", "Čekající na schválení")]
    Pending,
}

[Flags]
[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(ForType = typeof(TeamRole), GenerateAggreation = true, Name = "TeamRole")]
public enum TeamRole
{
    [MultiLang("Unknown", "Neznámý")]
    Unknown = 0,
    [MultiLang("Owner", "Vlastník")]
    Owner,
    [MultiLang("Editor", "Editor")]
    Editor,
    [MultiLang("Viewer", "Pouze pro čtení")]
    Viewer,
    [MultiLang("Member", "Člen")]
    Member,
}
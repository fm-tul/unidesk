using System.Text.Json.Serialization;
using Unidesk.Client;

namespace Unidesk.Db.Models;

public class UserInTeam
{
    public Guid UserId { get; set; }
    public User User { get; set; }

    public Team Team { get; set; }
    public Guid TeamId { get; set; }

    public UserInTeamStatus Status { get; set; }
    
    public TeamRole Role { get; set; }

    public static bool Compare(UserInTeam a, UserInTeam b)
    {
        return a.UserId == b.UserId && a.TeamId == b.TeamId;
    }

    public static UserInTeam Convert(Guid userId, Guid teamId, UserInTeamStatus status, TeamRole role)
    {
        return new UserInTeam
        {
            UserId = userId,
            TeamId = teamId,
            Status = status,
            Role = role,
        };
    }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(ForType = typeof(UserInTeamStatus), GenerateAggregation = true, Name = "UserInTeamStatus")]
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
    [MultiLang(("Requested"), "Požadavek odeslán")]
    Requested,
}

[Flags]
[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(ForType = typeof(TeamRole), GenerateAggregation = true, Name = "TeamRole")]
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
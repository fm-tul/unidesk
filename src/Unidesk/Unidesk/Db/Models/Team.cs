using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class Team : TrackedEntity
{
    public List<UserInTeam> UserInTeams { get; set; }

    public string Name { get; set; }
    public string Description { get; set; }
    public string Avatar { get; set; }
}

public enum UserInTeamStatus
{
    Invited,
    Accepted,
    Declined,
    Removed
}
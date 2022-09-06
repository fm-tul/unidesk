using Unidesk.Server;

namespace Unidesk.Db.Models;

public class UserInTeam
{
    public Guid UserId { get; set; }
    public User User { get; set; }

    [IgnoreMapping]
    public Team Team { get; set; }
    public Guid TeamId { get; set; }

    public UserInTeamStatus Status { get; set; }
}
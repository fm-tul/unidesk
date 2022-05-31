namespace Unidesk.Db.Models;

public class UserInTeam
{
    public Guid UserId { get; set; }
    public User User { get; set; }

    public Guid TeamId { get; set; }
    public Team Team { get; set; }

    public UserInTeamStatus Status { get; set; }
}
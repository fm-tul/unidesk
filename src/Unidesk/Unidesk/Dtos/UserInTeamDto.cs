using Unidesk.Db.Models;
using Unidesk.Server;

namespace Unidesk.Dtos;

public class UserInTeamDto
{
    public Guid UserId { get; set; }
    public UserDto User { get; set; }

    
    [IgnoreMapping]
    public string Team { get; set; }
    public Guid TeamId { get; set; }

    public UserInTeamStatus Status { get; set; }
}
using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Models;

namespace Unidesk.Dtos.ReadOnly;

public class UserTeamLookupDto : DtoBase
{
    [Required]
    public TeamLookupDto Team { get; set; }
    [Required]
    public UserInTeamStatus Status { get; set; }
    [Required]
    public TeamRole Role { get; set; }
}
using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Models;

namespace Unidesk.Dtos.ReadOnly;

public class TeamUserLookupDto : DtoBase
{
    [Required]
    public UserLookupDto User { get; set; }
    [Required]
    public UserInTeamStatus Status { get; set; }
    [Required]
    public TeamRole Role { get; set; }
}
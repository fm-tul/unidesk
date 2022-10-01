using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Models;
using Unidesk.Server;

namespace Unidesk.Dtos;

public class UserInTeamDto : DtoBase
{
    public Guid UserId { get; set; }
    public UserSimpleDto User { get; set; }
    
    public Guid TeamId { get; set; }
    public TeamSimpleDto Team { get; set; }
    
    public UserInTeamStatus Status { get; set; }
    public TeamRole Role { get; set; }
    
    [Required]
    [IgnoreMapping]
    public string Id => $"{UserId}_{TeamId}";
}
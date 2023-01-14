using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Models;

namespace Unidesk.Dtos;

public class TeamLookupDto : DtoBase
{
    [Required]
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public List<UserTeamRoleDto> UserTeamRoles { get; set; } = new();
}

public class UserTeamRoleDto : DtoBase
{
    [Required]
    public Guid UserId { get; set; }

    [Required]
    public UserInTeamStatus Status { get; set; }

    [Required]
    public TeamRole Role { get; set; }
}
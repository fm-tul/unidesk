using System.ComponentModel.DataAnnotations;
using FluentValidation;
using Unidesk.Db.Models;
using Unidesk.Validations;

namespace Unidesk.Dtos;

public class TeamDto : TrackedEntityDto
{
    [Required]
    public List<UserInTeamDto> UserInTeams { get; set; } = new();

    [Required]
    public List<UserSimpleDto> Users { get; set; } = new();


    public string Name { get; set; }
    public string Description { get; set; }

    public string? Avatar { get; set; }
    public TeamType Type { get; set; }


    public static void ValidateAndThrow(TeamDto item) => new TeamDtoValidator().ValidateAndThrow(item);
}
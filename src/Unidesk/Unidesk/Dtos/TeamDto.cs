using System.ComponentModel.DataAnnotations;
using FluentValidation;
using Newtonsoft.Json;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Server;
using Unidesk.Utils.Extensions;

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


    public class AValidator : AbstractValidator<TeamDto>
    {
        public AValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Type).NotEmpty();
        }
    }

    public static AbstractValidator<TeamDto> GetValidator() => new AValidator();
}
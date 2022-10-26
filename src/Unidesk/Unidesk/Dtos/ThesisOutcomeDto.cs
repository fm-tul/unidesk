using System.ComponentModel.DataAnnotations;
using FluentValidation;
using Unidesk.Validations;

namespace Unidesk.Dtos;

public class ThesisOutcomeDto : TrackedEntityDto, IValidatedEntity<ThesisOutcomeDto>
{
    [Required]
    public string NameEng { get; set; }

    [Required]
    public string NameCze { get; set; }

    [Required]
    public string? DescriptionEng { get; set; }

    [Required]
    public string? DescriptionCze { get; set; }

    public void ValidateAndThrow(ThesisOutcomeDto item) => new ThesisOutcomeDtoValidation().ValidateAndThrow(item);
}
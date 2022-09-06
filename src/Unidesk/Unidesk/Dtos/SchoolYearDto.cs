using System.ComponentModel.DataAnnotations;
using FluentValidation;

namespace Unidesk.Dtos;

public class SchoolYearDto : TrackedEntityDto
{
    [Required]
    public DateTime Start { get; set; }
    
    [Required]
    public DateTime End { get; set; }
    
    public string Name => $"{Start.Year:D2}/{End.Year:D2}";
}

public class SchoolYearDtoValidation : AbstractValidator<SchoolYearDto>
{
    public SchoolYearDtoValidation()
    {
        RuleFor(x => x.Start).LessThan(x => x.End);
    }
}
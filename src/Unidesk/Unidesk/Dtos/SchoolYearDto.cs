using System.ComponentModel.DataAnnotations;
using FluentValidation;
using Unidesk.Validations;

namespace Unidesk.Dtos;

public class SchoolYearDto : TrackedEntityDto
{
    [Required]
    public DateTime Start { get; set; }
    
    [Required]
    public DateTime End { get; set; }
    
    [Required]
    public string Name => $"{Start.Year:D2}/{End.Year:D2}";
    public static void ValidateAndThrow(SchoolYearDto item) => new SchoolYearDtoValidation().ValidateAndThrow(item);
}
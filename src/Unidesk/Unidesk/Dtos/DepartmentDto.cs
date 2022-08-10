using System.ComponentModel.DataAnnotations;
using FluentValidation;

namespace Unidesk.Dtos;

public class DepartmentDto : TrackedEntityDto
{
    [Required]
    public string NameEng { get; set; }
    
    [Required]
    public string NameCze { get; set; }
    
    [Required]
    public string? Code { get; set; }
    
    [Required]
    public string? DescriptionEng { get; set; }
    
    [Required]
    public string? DescriptionCze { get; set; }
}

public class DepartmentDtoValidation : AbstractValidator<DepartmentDto>
{
    public DepartmentDtoValidation()
    {
        RuleFor(x => x.NameEng).NotEmpty().WithMessage("Name is required");
        RuleFor(x => x.NameCze).NotEmpty().WithMessage("Name is required");
        RuleFor(x => x.Code).NotEmpty().WithMessage("Code is required");
        RuleFor(x => x.DescriptionEng);
        RuleFor(x => x.DescriptionCze);
    }
}
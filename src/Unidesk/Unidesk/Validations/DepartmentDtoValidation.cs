using FluentValidation;
using Unidesk.Dtos;

namespace Unidesk.Validations;

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
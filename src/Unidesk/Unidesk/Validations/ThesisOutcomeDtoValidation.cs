using FluentValidation;
using Unidesk.Dtos;

namespace Unidesk.Validations;

public class ThesisOutcomeDtoValidation : AbstractValidator<ThesisOutcomeDto>
{
    public ThesisOutcomeDtoValidation()
    {
        RuleFor(x => x.NameEng).NotEmpty().WithMessage("Name is required");
        RuleFor(x => x.NameCze).NotEmpty().WithMessage("Name is required");
        RuleFor(x => x.DescriptionEng);
        RuleFor(x => x.DescriptionCze);
    }
}
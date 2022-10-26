using FluentValidation;
using Unidesk.Dtos;

namespace Unidesk.Validations;

public class StudyProgrammeDtoValidation : AbstractValidator<StudyProgrammeDto>
{
    public StudyProgrammeDtoValidation()
    {
        RuleFor(x => x.NameEng).NotEmpty().WithMessage("Name is required");
        RuleFor(x => x.NameCze).NotEmpty().WithMessage("Name is required");
        RuleFor(x => x.Code);
        RuleFor(x => x.DescriptionEng);
        RuleFor(x => x.DescriptionCze);
    }
}
using FluentValidation;
using Unidesk.Dtos;

namespace Unidesk.Validations;

public class SchoolYearDtoValidation : AbstractValidator<SchoolYearDto>
{
    public SchoolYearDtoValidation()
    {
        RuleFor(x => x.Start).LessThan(x => x.End);
        // ThesisDeadline is either null or less than End and greater than Start
        RuleFor(x => x.ThesisDeadline).LessThan(x => x.End).GreaterThan(x => x.Start);
    }
}
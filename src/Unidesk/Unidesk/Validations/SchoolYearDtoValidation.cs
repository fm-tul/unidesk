using FluentValidation;
using Unidesk.Dtos;

namespace Unidesk.Validations;

public class SchoolYearDtoValidation : AbstractValidator<SchoolYearDto>
{
    public SchoolYearDtoValidation()
    {
        RuleFor(x => x.Start).LessThan(x => x.End);
    }
}
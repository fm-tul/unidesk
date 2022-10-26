using FluentValidation;
using Unidesk.Dtos;

namespace Unidesk.Validations;

public class TeamDtoValidator : AbstractValidator<TeamDto>
{
    public TeamDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.Description).NotEmpty();
        RuleFor(x => x.Type).NotEmpty();
    }
}
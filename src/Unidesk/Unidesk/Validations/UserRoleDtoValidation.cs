using FluentValidation;
using Unidesk.Dtos;

namespace Unidesk.Validations;

public class UserRoleDtoValidation : AbstractValidator<UserRoleDto>
{
    public UserRoleDtoValidation()
    {
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.Description).NotEmpty().WithSeverity(Severity.Warning);
        RuleFor(x => x.Grants).NotEmpty().WithSeverity(Severity.Warning);
    }
}
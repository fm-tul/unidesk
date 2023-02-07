using FluentValidation;
using Unidesk.Db.Models;
using Unidesk.Dtos;

namespace Unidesk.Validations;

public class ThesisDtoValidator : AbstractValidator<ThesisDto>
{
    public static void ValidateAndThrow(ThesisDto dto) => new ThesisDtoValidator().ValidateAndThrow(dto);
    
    public ThesisDtoValidator()
    {
        RuleFor(x => x.NameCze).NotEmpty();
        RuleFor(x => x.NameEng).NotEmpty();
        // RuleFor(x => x.AbstractCze).NotEmpty().WithSeverity(Severity.Warning).WithMessage("missing-abstract-cze");
        // RuleFor(x => x.AbstractEng).NotEmpty().WithSeverity(Severity.Warning).WithMessage("missing-abstract-eng");
        //
        // RuleFor(x => x.Keywords).NotEmpty();
        // RuleFor(x => x.Authors).NotEmpty();
        RuleFor(x => x.ThesisTypeCandidateIds)
           .Must((x, y) =>
            {
                switch (x.Status)
                {
                    case ThesisStatus.Draft:
                    case ThesisStatus.New:
                        return true;
                    
                    case ThesisStatus.Submitted:
                    case ThesisStatus.Finished_Susccessfully:
                    case ThesisStatus.Finished_Unsuccessfully:
                    case ThesisStatus.Finished:
                    case ThesisStatus.Assigned:
                        return y.Count == 0 && x.ThesisTypeId.HasValue;

                    case ThesisStatus.Reserved:
                    case ThesisStatus.Abandoned:
                    case ThesisStatus.Unknown:
                    default:
                        return true;
                }
            }).WithMessage("Submitted thesis must be of exactly one type");
    }
}
using System.ComponentModel.DataAnnotations;
using FluentValidation;
using Unidesk.Db.Models;
using Unidesk.Dtos.ReadOnly;
using Unidesk.Locales;
using Unidesk.Reports.Elements;

namespace Unidesk.Dtos;

public class ThesisEvaluationDto : TrackedEntityDto
{
    [Required]
    public Guid ThesisId { get; set; }

    [Required]
    public EvaluationStatus Status { get; set; }
    
    [Required]
    public string? RejectionReason { get; set; }

    // props which define the evaluation request
    [Required]
    public required Language Language { get; set; }

    [Required]
    public required string Email { get; set; }

    [Required]
    public required UserFunction UserFunction { get; set; }

    // after the evaluation is done, user will exist in the system and we can link it here
    public Guid? EvaluatorId { get; set; }
    public UserLookupDto? Evaluator { get; set; }
    public string EvaluatorFullName { get; set; }

    [Required]
    public Guid CreatedByUserId { get; set; }

    [Required]
    public UserLookupDto CreatedByUser { get; set; } = null!;

    public static void Validate(ThesisEvaluationDto dto)
    {
        new ThesisEvaluationDtoValidator().ValidateAndThrow(dto);
    }
}

public class ThesisEvaluationDetailDto : ThesisEvaluationPeekDto
{
    public object? Response { get; set; }

    [Required]
    public required List<ReportQuestion> Questions { get; set; } = new();

    public string? Format { get; set; }

    [Required]
    public List<string> FormatCandidates { get; set; } = new();
}

public class ThesisEvaluationPeekDto : ThesisEvaluationDto
{
    [Required]
    public required ThesisLookupDto Thesis { get; set; }
    // props which define the evaluation request
}

public class ThesisEvaluationDtoValidator : AbstractValidator<ThesisEvaluationDto>
{
    public ThesisEvaluationDtoValidator()
    {
        RuleFor(x => x.ThesisId).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}
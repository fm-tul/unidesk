using System.ComponentModel.DataAnnotations;
using FluentValidation;
using Unidesk.Db.Models.Internships;
using Unidesk.Dtos.ReadOnly;

namespace Unidesk.Dtos.Internships;

public class InternshipDto : TrackedEntityDto
{
    [Required]
    public InternshipStatus Status { get; set; }

    [Required]
    public UserLookupDto Student { get; set; }

    [Required]
    public string InternshipTitle { get; set; }

    [Required]
    public string CompanyName { get; set; }

    public string? Department { get; set; } = string.Empty;
    
    [Required]
    public bool IsArchived { get; set; }
    public Guid? SchoolYearId { get; set; }
    public string? SchoolYear { get; set; }
    

    [Required]
    public string Location { get; set; }

    [Required]
    public DateOnly StartDate { get; set; }
    [Required]
    public DateOnly EndDate { get; set; }

    public string? SupervisorName { get; set; } = string.Empty;

    public string? SupervisorPhone { get; set; } = string.Empty;

    public string? SupervisorEmail { get; set; } = string.Empty;

    [Required]
    public string Requirements { get; set; } = string.Empty;

    public string? Abstract { get; set; } = string.Empty;
    
    public string Comments { get; set; } = string.Empty;
    
    public string Note { get; set; } = string.Empty;

    [Required]
    public List<KeywordDto> Keywords { get; set; } = new();
    
    [Required]
    public List<EvaluationBasicDto> Evaluations { get; set; } = new();
    
    public static void ValidateAndThrow(InternshipDto item) => new InternshipDtoValidator().ValidateAndThrow(item);
}

public class InternshipDtoValidator : AbstractValidator<InternshipDto>
{
    public InternshipDtoValidator()
    {
        RuleFor(x => x.Status).NotNull();
        RuleFor(x => x.Student).NotNull();
        RuleFor(x => x.InternshipTitle).NotNull();
        RuleFor(x => x.CompanyName).NotNull();
        RuleFor(x => x.Location).NotNull();
        RuleFor(x => x.StartDate).GreaterThan(DateOnly.MinValue).WithMessage("Start date must be set").NotNull();
        RuleFor(x => x.EndDate).GreaterThan(DateOnly.MinValue).WithMessage("End date must be set").NotNull();
        RuleFor(x => x.Requirements).NotNull();
    }
    
    public static readonly string[] CanBeChangedWhenSubmittedProps = {
        nameof(Internship.SupervisorName),
        nameof(Internship.SupervisorEmail),
        nameof(Internship.SupervisorPhone),
        nameof(Internship.Department),
    };
}
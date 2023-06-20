using System.ComponentModel.DataAnnotations;
using FluentValidation;
using Newtonsoft.Json;
using Unidesk.Db.Models;
using Unidesk.Dtos.ReadOnly;
using Unidesk.Server;
using Unidesk.Validations;

namespace Unidesk.Dtos;

[HasMapping(typeof(Thesis))]
public class ThesisDto : TrackedEntityDto
{
    public long Adipidno { get; set; }
    public bool NeedsReview { get; set; }
    public bool Reviewed { get; set; }

    [Required]
    public string NameEng { get; set; }
    [Required]
    public string NameCze { get; set; }

    public string? AbstractEng { get; set; }
    public string? AbstractCze { get; set; }

    [Required]
    public List<KeywordDto> Keywords { get; set; } = new();

    /// <summary>
    /// School year of the thesis
    /// </summary>
    [Required]
    public Guid SchoolYearId { get; set; }

    /// <summary>
    /// Department of the thesis (e.g. NTI, ITE, MTI)
    /// </summary>
    [Required]
    public Guid DepartmentId { get; set; }

    /// <summary>
    /// Faculty of the thesis (e.g. FM, or maybe other faculties)
    /// </summary>
    [Required]
    public Guid FacultyId { get; set; }

    /// <summary>
    /// Study Programme of the thesis (e.g. Information Technology, Applied Sciences in Engineering)
    /// </summary>
    public Guid? StudyProgrammeId { get; set; }

    /// <summary>
    /// Status of the thesis (e.g. New, Assigned, etc.)
    /// </summary>
    [Required]
    public ThesisStatus Status { get; set; }

    /// <summary>
    /// Ids of the thesis types. During the approval phase, this is list of the thesis types, which are possible candidates for the thesis type
    /// After the thesis is accepted, this can be ignored (as it should be empty), and the selected type is used instead <see cref="ThesisType"/>
    /// </summary>
    [Required]
    public List<Guid> ThesisTypeCandidateIds { get; set; } = new();

    /// <summary>
    /// Ids of possible outcomes for the thesis (e.g. HW solution, SW solution, Modelling, etc.)
    /// </summary>
    [Required]
    public List<Guid> OutcomeIds { get; set; } = new();

    [Required]
    public List<string> Guidelines { get; set; } = new();

    
    /// <summary>
    /// List of recommended literature for the thesis (e.g. 1. Thesis, 2. Book, 3. Article, etc.)
    /// </summary>
    [Required]
    public List<string>  Literature { get; set; } = new();


    public int? Grade { get; set; }

    [Required, JsonIgnore]
    public List<ThesisLookupUserDto> ThesisUsers { get; set; } = new();
    
    [Required]
    public List<EvaluationBasicDto> Evaluations { get; set; } = new();
    
    [Required]
    public List<ThesisLookupUserDto> Authors => ThesisUsers.Where(x => x.Function == UserFunction.Author).ToList();
    
    [Required]
    public List<ThesisLookupUserDto> Supervisors => ThesisUsers.Where(x => x.Function == UserFunction.Supervisor).ToList();
    
    [Required]
    public List<ThesisLookupUserDto> Opponents => ThesisUsers.Where(x => x.Function == UserFunction.Opponent).ToList();

    [Required]
    public List<TeamLookupDto> Teams { get; set; } = new();
    
    public static void ValidateAndThrow(ThesisDto item) => new ThesisDtoValidator().ValidateAndThrow(item);
}
using System.ComponentModel.DataAnnotations;
using FluentValidation;
using Unidesk.Db.Models;
using Unidesk.Dtos.Resolvers;
using Unidesk.Server;
using Unidesk.Validations;

namespace Unidesk.Dtos;

[HasMapping(typeof(Thesis))]
public class ThesisDto : TrackedEntityDto
{
    public long Adipidno { get; set; }
    public bool NeedsReview { get; set; }
    public bool Reviewed { get; set; }

    public string NameEng { get; set; }
    public string NameCze { get; set; }

    public string? AbstractEng { get; set; }
    public string? AbstractCze { get; set; }

    [Required]
    public List<KeywordDto> Keywords { get; set; } = new();

    /// <summary>
    /// Schoold year of the thesis
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
    /// Selected type of the thesis (e.g. bachelor, master, PhD)
    /// before the thesis is accepted, this can be null, and possible candidates are used instead <see cref="ThesisTypeCandidateIds"/>
    /// </summary>
    public Guid? ThesisTypeId { get; set; }

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

    public string? Guidelines { get; set; }

    [Required]
    public List<string> GuidelinesList
    {
        get => StringListParser.Parse(Guidelines);
        set => Guidelines = StringListParser.Serialize(value);
    }

    /// <summary>
    /// List of recommended literature for the thesis (e.g. 1. Thesis, 2. Book, 3. Article, etc.)
    /// </summary>
    public string? Literature { get; set; }

    [Required]
    public List<string> LiteratureList
    {
        get => StringListParser.Parse(Literature);
        set => Literature = StringListParser.Serialize(value);
    }

    public int? Grade { get; set; }

    [IgnoreMapping]
    public List<ThesisUserDto> ThesisUsers { get; set; } = new();

    [Required]
    public List<UserDto> Authors { get; set; } = new();

    [Required]
    public List<UserDto> Supervisors { get; set; } = new();

    [Required]
    public List<UserDto> Opponents { get; set; } = new();

    [Required]
    [IgnoreMapping]
    public List<TeamDto> Teams { get; set; } = new();
    
    public static void ValidateAndThrow(ThesisDto item) => new ThesisDtoValidator().ValidateAndThrow(item);
}
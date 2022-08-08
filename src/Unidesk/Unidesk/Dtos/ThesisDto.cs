using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Models;
using Unidesk.Server;

namespace Unidesk.Dtos;

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
    public List<KeywordThesisDto> KeywordThesis { get; set; } = new List<KeywordThesisDto>();
    /// <summary>
    /// Schoold year of the thesis
    /// </summary>
    public SchoolYearDto SchoolYear { get; set; }
    public Guid SchoolYearId { get; set; }
    

    /// <summary>
    /// Department of the thesis (e.g. NTI, ITE, MTI)
    /// </summary>
    public DepartmentDto Department { get; set; }
    public Guid DepartmentId { get; set; }
    

    /// <summary>
    /// Faculty of the thesis (e.g. FM, or maybe other faculties)
    /// </summary>
    public Faculty Faculty { get; set; }
    public Guid FacultyId { get; set; }
    
    /// <summary>
    /// Study Programme of the thesis (e.g. Information Technology, Applied Sciences in Engineering)
    /// </summary>
    public StudyProgrammeDto StudyProgramme { get; set; }
    public Guid? StudyProgrammeId { get; set; }
    
    /// <summary>
    /// Status of the thesis (e.g. New, Assigned, etc.)
    /// </summary>
    [Required]
    public ThesisStatus Status { get; set; }
    
    /// <summary>
    /// Selected type of the thesis (e.g. bachelor, master, PhD)
    /// before the thesis is accepted, this can be null, and possible candidates are used instead <see cref="ThesisTypeCandidates"/>
    /// </summary>
    public ThesisType? ThesisType { get; set; }
    public Guid? ThesisTypeId { get; set; }

    /// <summary>
    /// types, which are possible candidates for the thesis type
    /// after the thesis is accepted, this can be ignored, and the selected type is used instead <see cref="ThesisType"/>
    /// </summary>
    public List<ThesisType> ThesisTypeCandidates { get; set; } = new List<ThesisType>();
    
    [IgnoreMapping]
    public List<Guid> ThesisTypeCandidateIds { get; set; } = new List<Guid>();
    
    /// <summary>
    /// List of possible outcomes for the thesis (e.g. HW solution, SW solution, Modelling, etc.)
    /// </summary>
    public List<ThesisOutcome> Outcomes { get; set; } = new List<ThesisOutcome>();
    
    [IgnoreMapping]
    public List<Guid> OutcomeIds { get; set; } = new List<Guid>();
    
    /// <summary>
    /// List of Guidlines for the thesis (e.g. 1. Research, 2. Do an experiment, 3. Do a simulation, etc.)
    /// </summary>
    public List<string> Guidelines { get; set; } = new List<string>();
    
    /// <summary>
    /// List of recommended literature for the thesis (e.g. 1. Thesis, 2. Book, 3. Article, etc.)
    /// </summary>
    public List<string> Literature { get; set; } = new List<string>();
    
    public int? Grade { get; set; }
    
    [Required]
    public List<UserDto> Users { get; set; } = new List<UserDto>();
    //
    // public List<Team> Teams { get; set; }
}
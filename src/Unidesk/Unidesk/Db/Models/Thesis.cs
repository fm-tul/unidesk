using System.Text.Json.Serialization;
using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class Thesis : TrackedEntity
{
    /// <summary>
    /// a numeric ID value from STAG (if available)
    /// </summary>
    public long? Adipidno { get; set; }

    /// <summary>
    /// If this thesis needs to be confirmed by some other party
    /// </summary>
    public bool NeedsReview { get; set; }

    /// <summary>
    /// Flag indicating the thesis was reviewed and accepted
    /// </summary>
    public bool Reviewed { get; set; }

    /// <summary>
    /// English title of the thesis
    /// </summary>
    public string NameEng { get; set; }

    /// <summary>
    /// Czech title of the thesis
    /// </summary>
    public string NameCze { get; set; }

    /// <summary>
    /// English abstract of the thesis
    /// </summary>
    public string? AbstractEng { get; set; }

    /// <summary>
    /// Czech abstract of the thesis
    /// </summary>
    public string? AbstractCze { get; set; }

    /// <summary>
    /// List of keywords for the thesis (both English and Czech)
    /// </summary>
    public List<KeywordThesis> KeywordThesis { get; set; } = new List<KeywordThesis>();

    // public string Image { get; set; }

    // public ??? Attachments { get; set; }


    /// <summary>
    /// Schoold year of the thesis
    /// </summary>
    public SchoolYear SchoolYear { get; set; }
    public Guid SchoolYearId { get; set; }



    /// <summary>
    /// Department of the thesis (e.g. NTI, ITE, MTI)
    /// </summary>
    public Department Department { get; set; }
    public Guid DepartmentId { get; set; }



    /// <summary>
    /// Faculty of the thesis (e.g. FM, or maybe other faculties)
    /// </summary>
    public Faculty Faculty { get; set; }
    public Guid FacultyId { get; set; }
    
    
    /// <summary>
    /// Study Programme of the thesis (e.g. Information Technology, Applied Sciences in Engineering)
    /// </summary>
    public StudyProgramme StudyProgramme { get; set; }
    public Guid? StudyProgrammeId { get; set; }



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


    /// <summary>
    /// List of possible outcomes for the thesis (e.g. HW solution, SW solution, Modelling, etc.)
    /// </summary>
    public List<ThesisOutcome> Outcomes { get; set; } = new List<ThesisOutcome>();

    /// <summary>
    /// Status of the thesis (e.g. New, Assigned, etc.)
    /// </summary>
    public ThesisStatus Status { get; set; }
    
    /// <summary>
    /// List of Guidlines for the thesis (e.g. 1. Research, 2. Do an experiment, 3. Do a simulation, etc.)
    /// </summary>
    public string? Guidelines { get; set; }
    
    /// <summary>
    /// List of recommended literature for the thesis (e.g. 1. Thesis, 2. Book, 3. Article, etc.)
    /// </summary>
    public string? Literature { get; set; }

    /// <summary>
    /// numerical Grade of the thesis (e.g. 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    /// </summary>
    public int? Grade { get; set; }

    /// <summary>
    /// List of users who are assigned to the thesis, after the thesis is accepted must contain at least one user (or one team)
    /// </summary>
    public List<User> Users { get; set; } = new List<User>();

    /// <summary>
    ///List of teams who are assigned to the thesis, after the thesis is accepted must contain at least one user (or one team)
    /// </summary>
    public List<Team> Teams { get; set; } = new List<Team>();
    // public List<Review> Reviews { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ThesisReportRelation
{
    Supervisor = 0,
    Opponent = 1,
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ThesisStatus
{
    Draft = 0,
    New = 1,
    Reserved = 2,
    Assigned = 3,
    Submitted = 4,
    Finished_Susccessfully = 5,
    Finished_Unsuccessfully = 6,
    Finished = 7,
    Abandoned = 8,
    Unknown = 666
}
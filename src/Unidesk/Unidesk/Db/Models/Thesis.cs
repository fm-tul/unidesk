using System.ComponentModel.DataAnnotations.Schema;
using Unidesk.Db.Core;
using Unidesk.Dtos.Resolvers;
using Unidesk.Server;

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
    [IgnoreMapping]
    public List<KeywordThesis> KeywordThesis { get; set; } = new();
    
    [NotMapped]
    public List<Keyword> Keywords => KeywordThesis.Select(x => x.Keyword).ToList();


    /// <summary>
    /// Schoold year of the thesis
    /// </summary>
    [IgnoreMapping]
    public SchoolYear SchoolYear { get; set; }
    public Guid SchoolYearId { get; set; }


    /// <summary>
    /// Department of the thesis (e.g. NTI, ITE, MTI)
    /// </summary>
    [IgnoreMapping]
    public Department Department { get; set; }
    public Guid DepartmentId { get; set; }


    /// <summary>
    /// Faculty of the thesis (e.g. FM, or maybe other faculties)
    /// </summary>
    [IgnoreMapping]
    public Faculty Faculty { get; set; }
    public Guid FacultyId { get; set; }
    
    
    /// <summary>
    /// Study Programme of the thesis (e.g. Information Technology, Applied Sciences in Engineering)
    /// </summary>
    [IgnoreMapping]
    public StudyProgramme StudyProgramme { get; set; }
    public Guid? StudyProgrammeId { get; set; }


    /// <summary>
    /// Selected type of the thesis (e.g. bachelor, master, PhD)
    /// before the thesis is accepted, this can be null, and possible candidates are used instead <see cref="ThesisTypeCandidates"/>
    /// </summary>
    [IgnoreMapping]
    public ThesisType? ThesisType { get; set; }
    public Guid? ThesisTypeId { get; set; }

    /// <summary>
    /// types, which are possible candidates for the thesis type
    /// after the thesis is accepted, this can be ignored, and the selected type is used instead <see cref="ThesisType"/>
    /// </summary>
    [IgnoreMapping]
    public List<ThesisType> ThesisTypeCandidates { get; set; } = new();
    [NotMapped]
    public IEnumerable<Guid> ThesisTypeCandidateIds => ThesisTypeCandidates.Select(x => x.Id).ToList();


    /// <summary>
    /// List of possible outcomes for the thesis (e.g. HW solution, SW solution, Modelling, etc.)
    /// </summary>
    [IgnoreMapping]
    public List<ThesisOutcome> Outcomes { get; set; } = new();
    [NotMapped]
    public IEnumerable<Guid> OutcomeIds => Outcomes.Select(x => x.Id).ToList();

    /// <summary>
    /// Status of the thesis (e.g. New, Assigned, etc.)
    /// </summary>
    public ThesisStatus Status { get; set; }
    
    /// <summary>
    /// List of Guidlines for the thesis (e.g. 1. Research, 2. Do an experiment, 3. Do a simulation, etc.)
    /// </summary>
    public string? Guidelines { get; set; }
    [NotMapped]
    public List<string> GuidelinesList 
    {
        get => StringListParser.Parse(Guidelines);
        set => Guidelines = StringListParser.Serialize(value);
    }
    
    /// <summary>
    /// List of recommended literature for the thesis (e.g. 1. Thesis, 2. Book, 3. Article, etc.)
    /// </summary>
    public string? Literature { get; set; }

    [NotMapped]
    public List<string> LiteratureList
    {
        get => StringListParser.Parse(Literature);
        set => Literature = StringListParser.Serialize(value);
    }

    /// <summary>
    /// numerical Grade of the thesis (e.g. 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    /// </summary>
    public int? Grade { get; set; }

    /// <summary>
    /// List of users who are assigned to the thesis, after the thesis is accepted must contain at least one user (or one team)
    /// </summary>
    [IgnoreMapping]
    public List<ThesisUser> ThesisUsers { get; set; } = new();
    
    [NotMapped]
    public List<User> Authors => ThesisUsers.Where(i => i.Function == UserFunction.Author).Select(x => x.User).ToList();
    
    [NotMapped]
    public List<User> Supervisors => ThesisUsers.Where(i => i.Function == UserFunction.Supervisor).Select(x => x.User).ToList();
    
    [NotMapped]
    public List<User> Opponents => ThesisUsers.Where(i => i.Function == UserFunction.Opponent).Select(x => x.User).ToList();
    

    /// <summary>
    ///List of teams who are assigned to the thesis, after the thesis is accepted must contain at least one user (or one team)
    /// </summary>
    public List<Team> Teams { get; set; } = new();
    // public List<Review> Reviews { get; set; }
}
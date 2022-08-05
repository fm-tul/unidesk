using System.Text.Json.Serialization;
using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class Thesis : TrackedEntity
{
    public long Adipidno { get; set; }
    public bool NeedsReview { get; set; }
    public bool Reviewed { get; set; }

    public string NameEng { get; set; }
    public string NameCze { get; set; }

    public string? AbstractEng { get; set; }
    public string? AbstractCze { get; set; }

    public List<KeywordThesis> KeywordThesis { get; set; } = new List<KeywordThesis>();

    // public string Image { get; set; }

    // public ??? Attachments { get; set; }

    public Guid SchoolYearId { get; set; }
    public SchoolYear SchoolYear { get; set; }
    

    public Guid DepartmentId { get; set; }
    public Department Department { get; set; }
    

    public Guid FacultyId { get; set; }
    public Faculty Faculty { get; set; }
    

    public Guid ThesisTypeId { get; set; }
    public ThesisType ThesisType { get; set; }

    public List<ThesisOutcome> Outcomes { get; set; } = new List<ThesisOutcome>();

    public ThesisStatus Status { get; set; }

    public int? Grade { get; set; }

    public List<User> Users { get; set; } = new List<User>();

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
    Assigned= 3,
    Submitted = 4,
    Finished = 5,
    Unknown = 666
}
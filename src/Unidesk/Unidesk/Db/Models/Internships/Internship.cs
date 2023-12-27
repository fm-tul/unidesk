using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Unidesk.Db.Core;

namespace Unidesk.Db.Models.Internships;

public class Internship : TrackedEntity
{
 
    [Required]
    public InternshipStatus Status { get; set; } = InternshipStatus.Draft;
    
    // who
    [Required]
    public Guid StudentId { get; set; }
    
    [Required]
    public User Student  { get; set; }
    
    [Required]
    public bool IsArchived { get; set; }
    
    public Guid? SchoolYearId { get; set; }
    public SchoolYear? SchoolYear { get; set; }
    

    // where
    [Required]
    public string InternshipTitle { get; set; } = null!;

    [Required]
    public string CompanyName { get; set; } = null!;

    public string Department { get; set; } = string.Empty;

    [Required]
    public string Location { get; set; } = null!;
    
    
    // when
    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }
    
    [NotMapped]
    public TimeSpan AfterStart => DateTime.UtcNow - StartDate;
    
    [NotMapped]
    public TimeSpan AfterEnd => DateTime.UtcNow - EndDate;
    
    [NotMapped]
    public long DurationDays => (EndDate - StartDate).Days;
    
    // under who
    [Required]
    public string SupervisorName { get; set; } = null!;

    [Required]
    public string SupervisorPhone { get; set; } = null!;

    [Required]
    [DataType(DataType.EmailAddress)]
    public string SupervisorEmail { get; set; } = null!;

    
    // what should be done
    public string Requirements { get; set; } = null!;
    public string Abstract { get; set; } = null!;
    public string Comments { get; set; }  = null!;
    public string Note { get; set; } = null!;

    /// <summary>
    /// List of keywords for the internship (both English and Czech)
    /// </summary>
    public List<KeywordInternship> KeywordInternship { get; set; } = new();
    public List<Evaluation> Evaluations { get; set; } = new();

    public List<Notification> Notifications { get; set; } = new();

    [NotMapped]
    public Notification? LastNotification => Notifications.MaxBy(i => i.Created);
    
    [NotMapped]
    public List<Keyword> Keywords => KeywordInternship.Select(x => x.Keyword).ToList();
}
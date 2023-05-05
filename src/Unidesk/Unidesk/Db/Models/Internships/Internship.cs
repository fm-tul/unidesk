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
    

    // where
    [Required]
    public string InternshipTitle { get; set; }

    [Required]
    public string CompanyName { get; set; }

    public string Department { get; set; } = string.Empty;

    [Required]
    public string Location { get; set; }
    
    
    // when
    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }
    
    [NotMapped]
    public TimeSpan AfterStart => DateTime.Now - StartDate;
    
    [NotMapped]
    public TimeSpan AfterEnd => DateTime.Now - EndDate;
    
    [NotMapped]
    public long DurationDays => (EndDate - StartDate).Days;
    
    // under who
    [Required]
    public string SupervisorName { get; set; }

    [Required]
    public string SupervisorPhone { get; set; }

    [Required]
    [DataType(DataType.EmailAddress)]
    public string SupervisorEmail { get; set; }

    
    // what should be done
    public string Requirements { get; set; }
    public string Abstract { get; set; }
    public string Comments { get; set; } 
    public string Note { get; set; }

    /// <summary>
    /// List of keywords for the internship (both English and Czech)
    /// </summary>
    public List<KeywordInternship> KeywordInternship { get; set; } = new();
    public List<Evaluation> Evaluations { get; set; } = new();
    
    [NotMapped]
    public List<Keyword> Keywords => KeywordInternship.Select(x => x.Keyword).ToList();
}
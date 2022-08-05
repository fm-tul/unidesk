using System.ComponentModel.DataAnnotations;

namespace Unidesk.Dtos;

public class KeywordThesisDto
{
    public Guid KeywordId { get; set; }
    public Guid ThesisId { get; set; }
    
    [Required]
    public string Keyword { get; set; }
    
    [Required]
    public string Locale { get; set; }
}
using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Models;

namespace Unidesk.Dtos;

public class KeywordThesisDto
{
    public Guid KeywordId { get; set; }
    public Guid ThesisId { get; set; }
    
    [Required]
    public string Value { get; set; }
    
    [Required]
    public string Locale { get; set; }
}
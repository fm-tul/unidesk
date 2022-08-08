using System.ComponentModel.DataAnnotations;

namespace Unidesk.Dtos;

public class ThesisOutcomeDto : TrackedEntityDto
{
    [Required]
    public string NameEng { get; set; }
    
    [Required]
    public string NameCze { get; set; }
    
    public string? DescriptionEng { get; set; }
    public string? DescriptionCze { get; set; }
}
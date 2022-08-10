using System.ComponentModel.DataAnnotations;

namespace Unidesk.Dtos;

public class FacultyDto : TrackedEntityDto
{
    [Required]
    public string NameEng { get; set; }
    
    [Required]
    public string NameCze { get; set; }
    
    [Required]
    public string? Code { get; set; }
    
    [Required]
    public string? DescriptionEng { get; set; }
    
    [Required]
    public string? DescriptionCze { get; set; }
}
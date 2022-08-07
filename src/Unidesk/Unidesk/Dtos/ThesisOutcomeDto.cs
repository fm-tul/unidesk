namespace Unidesk.Dtos;

public class ThesisOutcomeDto : TrackedEntityDto
{
    public string NameEng { get; set; }
    public string NameCze { get; set; }
    
    public string? DescriptionEng { get; set; }
    public string? DescriptionCze { get; set; }
}
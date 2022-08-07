namespace Unidesk.Dtos;

public class SchoolYearDto : TrackedEntityDto
{
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public string Name => $"{Start.Year:D2}-{End.Year:D2}";
}
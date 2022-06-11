namespace Unidesk.Dtos;

public class KeywordDto : TrackedEntityDto
{
    public string Value { get; set; }
    public string Locale { get; set; }
    public int Used { get; set; }
}
namespace Unidesk.Dtos.Documents;

public class DocumentDto: TrackedEntityDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public long? Size { get; set; }
    public string? ContentType { get; set; }
    public string? Extension { get; set; }

    public Guid? DocumentContentId { get; set; }
    public string DocumentContent { get; set; } = string.Empty;
}
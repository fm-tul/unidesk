namespace Unidesk.Dtos.Internships;

public class BulkEditInternshipsDto
{
    public List<Guid> InternshipIds { get; set; } = new();
    public bool? IsArchived { get; set; }
    public Guid? SchoolYearId { get; set; }
}
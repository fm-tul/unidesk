namespace Unidesk.Dtos;

public class TrackedEntityDto : IdEntityDto
{
    public DateTime Created { get; set; } = DateTime.Now;
    public string? CreatedBy { get; set; }

    public DateTime Modified { get; set; } = DateTime.Now;
    public string? ModifiedBy { get; set; }
}
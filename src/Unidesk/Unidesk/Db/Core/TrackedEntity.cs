namespace Unidesk.Db.Core;

public class TrackedEntity : IdEntity
{
    public DateTime Created { get; set; } = DateTime.Now;
    public string? CreatedBy { get; set; }

    public DateTime Modified { get; set; } = DateTime.Now;
    public string? ModifiedBy { get; set; }

    public bool IsNew => DateOnly.FromDateTime(Created) == DateOnly.FromDateTime(DateTime.Now)
                         && (TimeOnly.FromDateTime(Created) - TimeOnly.FromDateTime(DateTime.Now)) < TimeSpan.FromMilliseconds(1);
}
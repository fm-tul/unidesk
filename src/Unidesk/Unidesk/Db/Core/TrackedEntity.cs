namespace Unidesk.Db.Core;

public class TrackedEntity : IdEntity
{
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public string? CreatedBy { get; set; }

    public DateTime Modified { get; set; } = DateTime.UtcNow;
    public string? ModifiedBy { get; set; }
    
    public bool IsNew => DateOnly.FromDateTime(Created) == DateOnly.FromDateTime(DateTime.UtcNow)
                         && (TimeOnly.FromDateTime(Created) - TimeOnly.FromDateTime(DateTime.UtcNow)) < TimeSpan.FromMilliseconds(1);
}
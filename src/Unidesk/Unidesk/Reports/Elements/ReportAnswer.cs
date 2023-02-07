using System.ComponentModel.DataAnnotations;

namespace Unidesk.Reports.Elements;

public class ReportAnswer
{
    [Required]
    public required Guid Id { get; set; }
    public object? Answer { get; set; }
}
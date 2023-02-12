using System.ComponentModel.DataAnnotations;

namespace Unidesk.Reports.Elements;

public class TextQuestion : ReportQuestion
{
    [Required]
    public int Rows { get; init; } = 1;
}
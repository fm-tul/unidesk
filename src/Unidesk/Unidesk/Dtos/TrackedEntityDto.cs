using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Server;

namespace Unidesk.Dtos;

[SwaggerSubType(typeof(KeywordDto))]
[SwaggerSubType(typeof(ThesisDto))]
public class TrackedEntityDto : IdEntityDto
{
    [Required]
    public DateTime Created { get; set; } = DateTime.Now;
    public string? CreatedBy { get; set; }

    [Required]
    public DateTime Modified { get; set; } = DateTime.Now;
    public string? ModifiedBy { get; set; }

    public bool IsNew => false;
    public bool IsNew2 => DateOnly.FromDateTime(Created) == DateOnly.FromDateTime(DateTime.Now)
                         && (TimeOnly.FromDateTime(Created) - TimeOnly.FromDateTime(DateTime.Now)) < TimeSpan.FromMilliseconds(1);
}
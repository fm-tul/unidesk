using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;

namespace Unidesk.Dtos;

[SwaggerSubType(typeof(KeywordDto))]
[SwaggerSubType(typeof(ThesisDto))]
[SwaggerSubType(typeof(DepartmentDto))]
[SwaggerSubType(typeof(SchoolYearDto))]
[SwaggerSubType(typeof(FacultyDto))]
[SwaggerSubType(typeof(ThesisOutcomeDto))]
[SwaggerSubType(typeof(ThesisTypeDto))]
[SwaggerSubType(typeof(StudyProgrammeDto))]
[SwaggerSubType(typeof(TeamDto))]
[SwaggerSubType(typeof(UserDto))]
public class TrackedEntityDto : IdEntityDto
{
    [Required]
    public DateTime Created { get; set; } = DateTime.Now;
    public string? CreatedBy { get; set; }

    [Required]
    public DateTime Modified { get; set; } = DateTime.Now;
    public string? ModifiedBy { get; set; }
}
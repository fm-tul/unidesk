using System.ComponentModel.DataAnnotations;

namespace Unidesk.Dtos;

public class EnumsDto : DtoBase
{
    [Required]
    public List<DepartmentDto> Departments { get; set; } = new();

    [Required]
    public List<FacultyDto> Faculties { get; set; } = new();

    [Required]
    public List<SchoolYearDto> SchoolYears { get; set; } = new();

    [Required]
    public List<ThesisOutcomeDto> ThesisOutcomes { get; set; } = new();

    [Required]
    public List<ThesisTypeDto> ThesisTypes { get; set; } = new();

    [Required]
    public List<StudyProgrammeDto> StudyProgrammes { get; set; } = new();
}
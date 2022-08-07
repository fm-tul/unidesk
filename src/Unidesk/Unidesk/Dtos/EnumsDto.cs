using Unidesk.Db.Models;

namespace Unidesk.Dtos;

public class EnumsDto
{
    public List<DepartmentDto> Departments { get; set; }
    public List<FacultyDto> Faculties { get; set; }
    public List<SchoolYearDto> SchoolYears { get; set; }
    public List<ThesisOutcomeDto> ThesisOutcomes { get; set; }
    public List<ThesisTypeDto> ThesisTypes { get; set; }
    public List<StudyProgrammeDto> StudyProgrammes { get; set; }
}
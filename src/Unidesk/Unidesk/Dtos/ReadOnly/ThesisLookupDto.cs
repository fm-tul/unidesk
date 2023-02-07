using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Unidesk.Db.Models;

namespace Unidesk.Dtos.ReadOnly;

public class ThesisLookupDto : TrackedEntityDto
{
    public long? Adipidno { get; set; }
    
    [Required]
    public string NameEng { get; set; } = null!;
    [Required]
    public string NameCze { get; set; } = null!;
    
    [Required]
    public string AbstractEng { get; set; } = null!;
    
    [Required]
    public string AbstractCze { get; set; } = null!;
    
    [Required]
    public List<KeywordDto> Keywords { get; set; } = new();
    
    [Required]
    public ThesisStatus Status { get; set; }
    
    [Required]
    public Guid SchoolYearId { get; set; }
    
    [Required]
    public List<Guid> ThesisTypeCandidateIds { get; set; } = new();
    public Guid? ThesisTypeId { get; set; }
    
    [Required, JsonIgnore]
    public List<ThesisLookupUserDto> ThesisUsers { get; set; } = new();
    
    [Required]
    public List<ThesisLookupUserDto> Authors => ThesisUsers.Where(x => x.Function == UserFunction.Author).ToList();
    
    [Required]
    public List<ThesisLookupUserDto> Supervisors => ThesisUsers.Where(x => x.Function == UserFunction.Supervisor).ToList();
    
    [Required]
    public List<ThesisLookupUserDto> Opponents => ThesisUsers.Where(x => x.Function == UserFunction.Opponent).ToList();
}
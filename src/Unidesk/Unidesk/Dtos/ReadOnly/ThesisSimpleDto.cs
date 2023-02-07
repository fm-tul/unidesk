using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Models;

namespace Unidesk.Dtos.ReadOnly;

/// <summary>
/// The most basic information about a thesis itself. No information about the author or the supervisor.
/// </summary>
public class ThesisSimpleDto : IdEntityDto
{
    public long? Adipidno { get; set; }

    [Required]
    public string NameEng { get; set; } = null!;

    [Required]
    public string NameCze { get; set; } = null!;

    [Required]
    public ThesisStatus Status { get; set; }

    [Required]
    public List<Guid> ThesisTypeCandidateIds { get; set; } = new();

    public Guid? ThesisTypeId { get; set; }
}
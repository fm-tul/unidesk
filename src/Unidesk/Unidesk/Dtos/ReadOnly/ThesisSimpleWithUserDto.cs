using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Models;

namespace Unidesk.Dtos.ReadOnly;

/// <summary>
/// The most basic information about a thesis and user
/// </summary>
public class ThesisSimpleWithUserDto
{
    [Required]
    public required ThesisLookupDto Thesis { get; set; }

    [Required]
    public required UserLookupDto User { get; set; }
    
    [Required]
    public UserFunction Function { get; set; }
}
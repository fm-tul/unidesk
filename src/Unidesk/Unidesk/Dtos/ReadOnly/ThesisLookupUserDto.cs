using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Models;

namespace Unidesk.Dtos.ReadOnly;

public class ThesisLookupUserDto : DtoBase
{
    [Required]
    public UserLookupDto User { get; set; }
    
    [Required]
    public UserFunction Function { get; set; }
}
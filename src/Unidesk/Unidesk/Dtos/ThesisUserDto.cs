using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Models;
using Unidesk.Server;

namespace Unidesk.Dtos;

public class ThesisUserDto
{
    [Required]
    public UserDto User { get; set; }
    [Required]
    public Guid UserId { get; set; }
    
    [IgnoreMapping]
    public ThesisDto Thesis { get; set; }
    [Required]
    public Guid ThesisId { get; set; }
    
    public UserFunction Function { get; set; }
}
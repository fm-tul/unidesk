using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Models;

namespace Unidesk.Dtos.ReadOnly;

public class UserLookupDto : DtoBase
{
    [Required]
    public Guid Id { get; set; }

    public string? StagId { get; set; }
    public string? TitleBefore { get; set; }
    public string? TitleAfter { get; set; }

    [Required]
    public UserFunction UserFunction { get; set; }

    [Required]
    public string FullName { get; set; }
    
    public string? Email { get; set; }
}
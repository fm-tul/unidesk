using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Models;

namespace Unidesk.Dtos;

public class UserDto : TrackedEntityDto
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string? StagId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? MiddleName { get; set; }
    public string? TitleBefore { get; set; }
    public string? TitleAfter { get; set; }
    
    [Required]
    public List<Grant> Grants { get; set; } = new List<Grant>();
}
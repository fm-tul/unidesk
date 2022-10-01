using System.ComponentModel.DataAnnotations;

namespace Unidesk.Dtos;

public class TeamSimpleDto : DtoBase
{
    [Required]
    public Guid Id { get; set; }
    
    [Required]
    public string Name { get; set; }
}
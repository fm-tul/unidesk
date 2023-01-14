using System.ComponentModel.DataAnnotations;
using FluentValidation;
using Unidesk.Db.Models;
using Unidesk.Validations;

namespace Unidesk.Dtos;

public class UserRoleDto : TrackedEntityDto
{
    [Required]
    public string Name { get; set; }
    
    public string? Description { get; set; }
    
    [Required]
    public List<Grant> Grants { get; set; } = new();

    public static void ValidateAndThrow(UserRoleDto dto) => new UserRoleDtoValidation().ValidateAndThrow(dto);
}
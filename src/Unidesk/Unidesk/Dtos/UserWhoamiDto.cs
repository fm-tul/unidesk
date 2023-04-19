using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Unidesk.Configurations;
using Unidesk.Db.Models;
using Unidesk.Dtos.ReadOnly;
using Unidesk.Server;

namespace Unidesk.Dtos;

public class UserWhoamiDto : UserDto
{
    [Required]
    public EnvironmentType Environment { get; set; }
}
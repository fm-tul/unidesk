using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db.Core;
using Unidesk.Utils.Extensions;

namespace Unidesk.Dtos;

[SwaggerSubType(typeof(UserDto))]
public class UserSimpleDto : TrackedEntityDto, ISimpleUser
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? StagId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? FullName => this.FullName();
    public string? MiddleName { get; set; }
    public string? TitleBefore { get; set; }
    public string? TitleAfter { get; set; }
}
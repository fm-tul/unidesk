using System.ComponentModel.DataAnnotations;

namespace Unidesk.Db.Core;

public class IdEntity
{
    [Required]
    public Guid Id { get; set; } = Guid.NewGuid();
}
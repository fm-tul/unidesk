using System.ComponentModel.DataAnnotations;

namespace Unidesk.Db.Core;

public class IdEntity
{
    [Required]
    public Guid Id { get; set; } = Guid.NewGuid();


    public static bool Compare<T>(T a, T b) where T : IdEntity
    {
        return a.Id == b.Id;
    }
}
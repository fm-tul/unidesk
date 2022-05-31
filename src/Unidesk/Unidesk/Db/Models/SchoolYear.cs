using System.ComponentModel.DataAnnotations.Schema;
using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class SchoolYear : TrackedEntity
{

    [Column("Start")]
    internal DateTime _start { get; set; }
    [Column("End")]

    internal DateTime _end { get; set; }

    [NotMapped]
    public DateOnly Start
    {
        get => DateOnly.FromDateTime(_start);
        set => _start = value.ToDateTime(TimeOnly.MinValue);
    }

    [NotMapped]
    public DateOnly End
    {
        get => DateOnly.FromDateTime(_end);
        set => _end = value.ToDateTime(TimeOnly.MinValue);
    }
}
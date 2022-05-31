using System.ComponentModel.DataAnnotations.Schema;
using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class SchoolYear : IdEntity
{
    public DateTime Start { get; set; }
    public DateTime End { get; set; }

    [NotMapped]
    public DateOnly StartDateOnly
    {
        get => DateOnly.FromDateTime(Start);
        set => Start = value.ToDateTime(TimeOnly.MinValue);
    }

    [NotMapped]
    public DateOnly EndDateOnly
    {
        get => DateOnly.FromDateTime(End);
        set => End = value.ToDateTime(TimeOnly.MinValue);
    }
}
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class ChangeLog : IdEntity
{
    [Required]
    public string Entity { get; set; }

    public string? User { get; set; }

    [Required]
    public ChangeState State { get; set; }

    [Required]
    public DateTime DateTime { get; set; }

    [Required]
    public Guid EntityId { get; set; }

    public ChangeDetails? Details { get; set; }

    public static ChangeLog Create(EntityEntry entry, string? user)
    {
        var isAdded = entry.State == EntityState.Added;
        var details = entry.Properties
           .Where(i => isAdded || i.IsModified)
           .Select(i => new ChangeDetail
            {
                Property = i.Metadata.Name,
                OldValue = (i.IsModified ? i.OriginalValue : null)?.ToString(),
                NewValue = i.CurrentValue?.ToString(),
            })
           .ToList();

        return new ChangeLog
        {
            Entity = entry.Entity.GetType().ToString(),
            User = user,
            State = (ChangeState)entry.State,
            DateTime = DateTime.Now,
            EntityId = entry.Entity is IdEntity entity ? entity.Id : Guid.Empty,
            Details = new ChangeDetails
            {
                Details = details,
            },
        };
    }
}

public class ChangeDetails
{
    public List<ChangeDetail>? Details { get; set; } = new();
}

public class ChangeDetail
{
    public string Property { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ChangeState
{
    /// <summary>
    ///     The entity is not being tracked by the context.
    /// </summary>
    Detached = 0,

    /// <summary>
    ///     The entity is being tracked by the context and exists in the database. Its property
    ///     values have not changed from the values in the database.
    /// </summary>
    Unchanged = 1,

    /// <summary>
    ///     The entity is being tracked by the context and exists in the database. It has been marked
    ///     for deletion from the database.
    /// </summary>
    Deleted = 2,

    /// <summary>
    ///     The entity is being tracked by the context and exists in the database. Some or all of its
    ///     property values have been modified.
    /// </summary>
    Modified = 3,

    /// <summary>
    ///     The entity is being tracked by the context but does not yet exist in the database.
    /// </summary>
    Added = 4
}
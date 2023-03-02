using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class ChangeLog : IdEntity
{
    public string Entity { get; set; }
    public string? User { get; set; }
    public EntityState State { get; set; }
    public DateTime DateTime { get; set; }
    public Guid EntityId { get; set; }
    
    public static ChangeLog Create(EntityEntry entry, string? user)
    {
        return new ChangeLog
        {
            Entity = entry.Entity.GetType().ToString(),
            User = user,
            State = entry.State,
            DateTime = DateTime.Now,
            EntityId = entry.Entity is IdEntity entity ? entity.Id : Guid.Empty,
        };
    }
}
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos.Requests;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services;

public class ChangeTrackerService
{
    
    private readonly UnideskDbContext _db;
    public ChangeTrackerService(UnideskDbContext db)
    {
        _db = db;
    }

    public IQueryable<ChangeLog> Where(ChangeTrackerFilter filter)
    {
        var query = _db.ChangeLogs.AsQueryable();

        query = query.WhereIf(filter.State.HasValue, i => i.State == filter.State);
        query = query.WhereIf(filter.EntityId.HasValue, i => i.EntityId == filter.EntityId);
        query = query.WhereIf(filter.Entity.IsNotNullOrEmpty(), i => i.Entity == filter.Entity);
        query = query.WhereIf(filter.User.IsNotNullOrEmpty(), i => i.User == filter.User);
        
        return query;
    }
}
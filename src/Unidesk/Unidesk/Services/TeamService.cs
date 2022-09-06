using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Db.Models;

namespace Unidesk.Services;

public class TeamService
{
    private readonly UnideskDbContext _db;

    public TeamService(UnideskDbContext db)
    {
        _db = db;
    }
    
    public Task<List<Team>> FindAllAsync(string keyword)
    {
        var isGuid = Guid.TryParse(keyword, out var guid);
        return _db.Teams
            .Where(x =>
                (isGuid && x.Id == guid) ||
                (x.Name.Contains(keyword) ||
                (x.Description.Contains(keyword)))
            ).ToListAsync();
    }
}
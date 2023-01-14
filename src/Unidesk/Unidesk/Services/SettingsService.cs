using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services;

public class SettingsService
{
    private readonly UnideskDbContext _db;
    private readonly ILogger<SettingsService> _logger;

    public SettingsService(UnideskDbContext db, ILogger<SettingsService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<IEnumerable<UserRole>> GetRolesAsync()
    {
        return await _db.UserRoles.ToListAsync();
    }

    public async Task<UserRole> SaveRoleAsync(UserRole item)
    {
        var isNew = item.Id.IsEmpty();
        if (isNew)
        {
            item.Id = Guid.NewGuid();
            await _db.UserRoles.AddAsync(item);
        }
        else
        {
            _db.UserRoles.Update(item);
        }
        
        await _db.SaveChangesAsync();
        return item;
    }
}
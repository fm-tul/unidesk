using MapsterMapper;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Exceptions;
using Unidesk.Server;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services;

public class SettingsService
{
    private readonly UnideskDbContext _db;
    private readonly ILogger<SettingsService> _logger;
    private readonly IMapper _mapper;
    private readonly IOutputCacheStore _cacheStore;

    public SettingsService(UnideskDbContext db, ILogger<SettingsService> logger, IMapper mapper, IOutputCacheStore cacheStore)
    {
        _db = db;
        _logger = logger;
        _mapper = mapper;
        _cacheStore = cacheStore;
    }

    public async Task<IEnumerable<UserRole>> GetRolesAsync()
    {
        return await _db.UserRoles.ToListAsync();
    }

    public async Task<UserRole> SaveRoleAsync(UserRoleDto dto, CancellationToken ct)
    {
        var (isNew, item) = await _db.UserRoles
           .GetOrCreateFromDto(_mapper, dto, ct);
        NotFoundException.ThrowIfNullOrEmpty(item);

        if (isNew)
        {
            await _db.UserRoles.AddAsync(item, ct);
        }

        await _db.SaveChangesAsync(ct);
        await _cacheStore.EvictByTagAsync(EnumsCachedEndpoint.EnumsCacheTag, ct);
        return item;
    }

    public async Task<bool> DeleteRoleAsync(Guid id, CancellationToken ct)
    {
        var item = await _db.UserRoles
                      .Include(i => i.Users)
                      .FirstOrDefaultAsync(i => i.Id == id, ct)
                ?? throw new NotFoundException($"Role with id {id} not found");

        foreach (var user in item.Users.ToList())
        {
            user.Roles.Remove(item);
        }

        _db.UserRoles.Remove(item);
        await _db.SaveChangesAsync(ct);
        await _cacheStore.EvictByTagAsync(EnumsCachedEndpoint.EnumsCacheTag, ct);
        return true;
    }
}
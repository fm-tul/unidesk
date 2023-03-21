using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Dtos;

namespace Unidesk.Utils.Extensions;

public static class EntityExtensions
{
    public static ThesisUser StripToGuids(this ThesisUser thesisUser)
    {
        return new ThesisUser()
        {
            UserId = thesisUser.UserId,
            ThesisId = thesisUser.ThesisId,
            Function = thesisUser.Function,
        };
    }

    public static UserInTeam StripToGuids(this UserInTeam userInTeam)
    {
        userInTeam.Team = null;
        userInTeam.User = null;
        return userInTeam;
    }
}

public static class EntityQueryExtensions
{
    public static IQueryable<Thesis> Query(this DbSet<Thesis> dbSet)
    {
        return dbSet
           .Include(i => i.ThesisTypeCandidates)
           .Include(i => i.Outcomes)
           .Include(i => i.KeywordThesis)
           .ThenInclude(i => i.Keyword)
           .Include(i => i.ThesisUsers)
           .ThenInclude(i => i.User);
    }

    public static IQueryable<Team> Query(this DbSet<Team> dbSet)
    {
        return dbSet
           .Include(i => i.UserInTeams)
           .ThenInclude(i => i.Team)
           .Include(i => i.UserInTeams)
           .ThenInclude(i => i.User);
    }

    public static IQueryable<KeywordThesis> Query(this DbSet<KeywordThesis> dbSet)
    {
        return dbSet
           .Include(i => i.Keyword)
           .Include(i => i.Thesis);
    }

    public static IQueryable<User> Query(this DbSet<User> dbSet)
    {
        return dbSet
           .Include(i => i.Aliases)
           .Include(i => i.Roles)
           .Include(i => i.UserInTeams)
           .ThenInclude(i => i.Team);
    }

    public static T First<T>(this IQueryable<T> items, Guid id) where T : TrackedEntity
    {
        return items.First(i => i.Id == id);
    }

    public static T? FirstOrDefault<T>(this IQueryable<T> items, Guid id) where T : TrackedEntity
    {
        return items.FirstOrDefault(i => i.Id == id);
    }

    public static Task<T> FirstAsync<T>(this IQueryable<T> items, Guid id) where T : TrackedEntity
    {
        return items.FirstAsync(i => i.Id == id);
    }

    public static Task<T?> FirstOrDefaultAsync<T>(this IQueryable<T> items, Guid id) where T : TrackedEntity
    {
        return items.FirstOrDefaultAsync(i => i.Id == id);
    }

    public static async Task<(bool isNew, TEntity? item)> GetOrCreateFromDto<TDto, TEntity>(this IQueryable<TEntity> queryable, IMapper mapper, TDto dto) where TDto : IdEntityDto where TEntity : TrackedEntity, new()
    {
        var isNew = dto.Id.IsEmpty();
        var item = isNew
            ? new TEntity()
            : await queryable.FirstOrDefaultAsync(dto.Id);
        
        if (item == null)
        {
            return (isNew, null);
        }

        item = isNew
            ? mapper.Map<TEntity>(dto)
            : mapper.Map(dto, item);

        if (isNew)
        {
            item.Id = Guid.NewGuid();
        }

        return (isNew, item);
    }
    
    public static void RemoveIfExists<T>(this DbSet<T> dbSet, T? item) where T : class
    {
        if (item == null)
        {
            return;
        }

        dbSet.Remove(item);
    }
}

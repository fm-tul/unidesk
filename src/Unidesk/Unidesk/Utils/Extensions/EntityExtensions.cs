using Microsoft.EntityFrameworkCore;
using Unidesk.Db.Core;
using Unidesk.Db.Models;

namespace Unidesk.Utils.Extensions;

public static class EntityExtensions
{
    public static T StripToGuids<T>(this T entity) where T : TrackedEntity, new()
    {
        return new T()
        {
            Id = entity.Id
        };
    }

    public static ThesisUser StripToGuids(this ThesisUser thesisUser)
    {
        return new ThesisUser()
        {
            UserId = thesisUser.UserId,
            ThesisId = thesisUser.ThesisId,
            Function = thesisUser.Function
        };
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
    
    public static IQueryable<KeywordThesis> Query(this DbSet<KeywordThesis> dbSet)
    {
        return dbSet
            .Include(i => i.Keyword)
            .Include(i => i.Thesis);
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
}
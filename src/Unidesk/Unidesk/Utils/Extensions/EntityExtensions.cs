using System.Linq.Expressions;
using JetBrains.Annotations;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Db.Models.Internships;
using Unidesk.Dtos;

namespace Unidesk.Utils.Extensions;

public static class EntityExtensions
{
    
    public static IQueryable<T> WhereIf<T>(this IQueryable<T> queryable, bool condition, Expression<Func<T, bool>> predicate)
    {
        return condition ? queryable.Where(predicate) : queryable;
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
    
    public static IQueryable<Internship> Query(this DbSet<Internship> dbSet)
    {
        return dbSet
           .Include(i => i.SchoolYear)
           .Include(i => i.Notifications)
           .Include(i => i.Student)
           .Include(i => i.KeywordInternship)
           .ThenInclude(i => i.Keyword)
           .Include(i => i.Evaluations);
    }
    
    public static IQueryable<Evaluation> Query(this DbSet<Evaluation> dbSet)
    {
        return dbSet
           .Include(i => i.Thesis.ThesisType)
           .Include(i => i.Thesis.ThesisUsers)
           .ThenInclude(i => i.User)
           .Include(i => i.Evaluator)
           .Include(i => i.Internship.Student)
           .Include(i => i.Internship.Evaluations)
           .Include(i => i.Document.DocumentContent);
    }
    
    public static IQueryable<Document> Query(this DbSet<Document> dbSet)
    {
        return dbSet
           .Include(i => i.DocumentContent);
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

    public static Task<T?> FirstOrDefaultAsync<T>(this IQueryable<T> items, Guid id, CancellationToken ct) where T : IdEntity
    {
        return items.FirstOrDefaultAsync(i => i.Id == id, ct);
    }

    public static async Task<(bool isNew, TEntity? item)> GetOrCreateFromDto<TDto, TEntity>(this IQueryable<TEntity> queryable, IMapper mapper, TDto dto, CancellationToken ct) 
        where TDto : IdEntityDto where TEntity : IdEntity, new()
    {
        var isNew = dto.Id.IsEmpty();
        var item = isNew
            ? new TEntity()
            : await queryable.FirstOrDefaultAsync(dto.Id, ct);
        
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
    
    public static async Task<(bool isNew, TEntity? item)> GetOrCreateById<TEntity>(this IQueryable<TEntity> queryable, Guid id, CancellationToken ct) 
        where TEntity : IdEntity, new()
    {
        var isNew = id.IsEmpty();
        var item = isNew
            ? new TEntity()
            : await queryable.FirstOrDefaultAsync(id, ct);
        
        if (item == null)
        {
            return (isNew, null);
        }

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

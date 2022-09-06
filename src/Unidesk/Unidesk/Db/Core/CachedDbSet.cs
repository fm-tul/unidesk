using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Unidesk.Utils;

namespace Unidesk.Db.Core;

public class CachedDbSet<T> where T : class
{
    public DbSet<T> DbSet { get; set; }
    internal readonly List<T> _cache = new List<T>();
    private bool _isLoaded;
    
    public CachedDbSet(DbSet<T> dbSet)
    {
        DbSet = dbSet;
    }
    
    public async Task<List<T>> LoadCacheAsync(IQueryable<T>? query = null)
    {
        if (_isLoaded)
        {
            return _cache;
        }
        
        _isLoaded = true;
        _cache.Clear();
        _cache.AddRange(await (query ?? DbSet).ToListAsync());
        return _cache;
    }
    
    public List<T> LoadCache()
    {
        if (_isLoaded)
        {
            return _cache;
        }
        
        _isLoaded = true;
        _cache.Clear();
        _cache.AddRange(DbSet.ToList());
        return _cache;
    }

    public IQueryable<T> AsQueryable()
    {
        return new AsyncEnumerable<T>(_cache);
    }
}





public static class CachedDbSetExtensions
{
    public static  T AddAndReturn<T>(this CachedDbSet<T> cachedDbSet, T entity) where T: class
    {
        cachedDbSet.LoadCache();
        cachedDbSet._cache.Add(entity);
        cachedDbSet.DbSet.Add(entity);
        return entity;
    }
    
    public static async Task<T?> FirstOrDefaultAsync<T>(this CachedDbSet<T> cachedDbSet) where T : class
    {
        await cachedDbSet.LoadCacheAsync();
        return cachedDbSet._cache.FirstOrDefault();
    }
    
    public static EntityEntry<T> Add<T>(this CachedDbSet<T> cachedDbSet, T entity) where T: class
    {
        cachedDbSet.LoadCache();
        cachedDbSet._cache.Add(entity);
        return cachedDbSet.DbSet.Add(entity);
    }
    
    public static  async Task<EntityEntry<T> > AddAsync<T>(this CachedDbSet<T> cachedDbSet, T entity) where T: class
    {
        await cachedDbSet.LoadCacheAsync();
        cachedDbSet._cache.Add(entity);
        return await cachedDbSet.DbSet.AddAsync(entity);
    }
    
    public static void AddRange<T>(this CachedDbSet<T> cachedDbSet, IEnumerable<T> entities) where T: class
    {
        cachedDbSet.LoadCache();
        var collection = entities.ToList();
        cachedDbSet._cache.AddRange(collection);
        cachedDbSet.DbSet.AddRange(collection);
    }
    
    public static async Task AddRangeAsync<T>(this CachedDbSet<T> cachedDbSet, IEnumerable<T> entities) where T: class
    {
        await cachedDbSet.LoadCacheAsync();
        var collection = entities.ToList();
        cachedDbSet._cache.AddRange(collection);
        cachedDbSet.DbSet.AddRange(collection);
    }
    
    
    public static async Task<T?> FirstOrDefaultAsync<T>(this CachedDbSet<T> cachedDbSet, Func<T, bool> predicate) where T: class
    {
        await cachedDbSet.LoadCacheAsync();
        return cachedDbSet._cache.FirstOrDefault(predicate);
    }
    
    public static T? FirstOrDefault<T>(this CachedDbSet<T> cachedDbSet, Func<T, bool> predicate) where T: class
    {
        cachedDbSet.LoadCache();
        return cachedDbSet._cache.FirstOrDefault(predicate);
    }
    
    public static IEnumerable<T> Where<T>(this CachedDbSet<T> cachedDbSet, Func<T, bool> predicate) where T: class
    {
        cachedDbSet.LoadCache();
        return cachedDbSet._cache.Where(predicate);
    }
}
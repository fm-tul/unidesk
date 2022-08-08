using System.Data.Entity;
using AutoMapper;
using Microsoft.AspNetCore.OutputCaching;
using Unidesk.Db;
using Unidesk.Db.Core;
using Unidesk.Dtos;
using Unidesk.Server;

namespace Unidesk.Services.Enums;

public class SimpleEnumService
{
    private readonly UnideskDbContext _db;
    private readonly IMapper _mapper;
    private readonly IOutputCacheStore _cache;

    public SimpleEnumService(UnideskDbContext db, IMapper mapper, IOutputCacheStore cache)
    {
        _db = db;
        _mapper = mapper;
        _cache = cache;
    }
    
    // this GET method is used to get all the enum values for a given enum type
    public List<TDto> GetAll<TItem, TDto>() where TItem : class
    {
        var set = _db.Set<TItem>();
        var items = set.ToList();
        var dtos = _mapper.Map<List<TDto>>(items);
        return dtos;
    }
    
    // this POST method is used to create a new enum value for a given enum type or update an existing one
    // TItem : TrackedEntity, TDto : TrackedEntityDto
    public async Task<TItem> CreateOrUpdate<TItem, TDto>(TDto dto, CancellationToken ct)
        where TItem: TrackedEntity 
        where TDto : TrackedEntityDto
    {
        var dbSet = _db.Set<TItem>();
        var dtoIsNew = dto.Id == Guid.Empty;
        TItem item;
        
        // if the dto is new, create a new entity
        if (dtoIsNew)
        {
            item = _mapper.Map<TItem>(dto);
            item.Id = Guid.NewGuid();
            dbSet.Add(item);
        }
        // otherwise, update the existing entity
        else
        {
            item = dbSet.Find(dto.Id)
                   ?? throw new Exception($"Item of type {typeof(TItem)} with id {dto.Id} not found");
            _mapper.Map(dto, item);
        }
        
        //evict the cache for enums
         await _db.SaveChangesAsync(ct);
         await _cache.EvictByTagAsync(EnumsCachedEndpoint.EnumsCacheTag, ct);
         return _mapper.Map<TItem>(item);
    }
}
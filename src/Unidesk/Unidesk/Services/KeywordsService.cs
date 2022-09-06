using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos.Requests;
using Unidesk.Utils;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services;

public class KeywordsService
{
    private UnideskDbContext _db;

    public KeywordsService(UnideskDbContext db)
    {
        _db = db;
    }

    public List<SimilarKeyword> FindDuplicates(List<Keyword> keywords, bool onlyVerySimilar = true)
    {
        var similar = new List<SimilarKeyword>();
        var combinations = MathUtils.Combinations(keywords.ToList());
        foreach (var (a, b) in combinations)
        {
            var aValue = a.Value.RemoveWeirdCharacters().Replace(" ", string.Empty);
            var bValue = b.Value.RemoveWeirdCharacters().Replace(" ", string.Empty);
            
            if (onlyVerySimilar && Math.Abs(aValue.Length - bValue.Length) > 2)
            {
                continue;
            }

            if (aValue.Equals(bValue, StringComparison.InvariantCultureIgnoreCase))
            {
                similar.Add(new(0, 1, a, b));
                continue;
            }

            var distance = LevenshteinDistance.Comapare(aValue, bValue);
            var similarity = 1.0 - (double)distance / Math.Max(a.Value.Length, b.Value.Length);
            similar.Add(new(distance, similarity, a, b));
        }

        return similar
            .Where(i => !onlyVerySimilar ? (i.Similarity > 0.25) : ((i.Distance <= 2 && i.Similarity >= 0.75) || i.Similarity >= 0.90))
            .OrderByDescending(i => i.Similarity)
            .ThenBy(i => i.Distance)
            .Take(100)
            .ToList();
    }

    public IQueryable<Keyword> WhereFilter(KeywordFilter filter, bool includeUsage = false)
    {
        var query = includeUsage
            ? _db.Keywords.Include(i => i.KeywordThesis)
            : _db.Keywords.AsQueryable();

        if (filter.Keyword.IsNotNullOrEmpty())
        {
            query = query.Where(i => i.Value.StartsWith(filter.Keyword) || i.Value.Contains(filter.Keyword));
        }
        
        if (filter.UsedCount.HasValue)
        {
            var minUsage = filter.UsedCount switch
            {
                KeywordUsedCount.MoreThan1 => 1,
                KeywordUsedCount.MoreThan5 => 5,
                KeywordUsedCount.MoreThan10 => 10,
                _ => 0
            };
            
            query = query
                .Where(i => i.KeywordThesis.Count > minUsage);
        }
        
        return query;
    }

    public async Task<List<Keyword>> FindAsync(string keyword, int pageSize = 30, bool includeUsage = false)
    {
        // find exact match
        var query = includeUsage
            ? _db.Keywords.Include(i => i.KeywordThesis)
            : _db.Keywords.AsQueryable();
        
        var keywords = await query
            .OrderBy(i => i.Value)
            .Where(i => i.Value.StartsWith(keyword))
            .Take(20)
            .ToListAsync();

        // find partial match if number of results is less than pageSize
        if (keywords.Count < pageSize)
        {
            var excludeIds = keywords.Select(i => i.Id).ToList();
            keywords.AddRange(await query
                .OrderBy(i => i.Value)
                .Where(i => !excludeIds.Contains(i.Id) && i.Value.Contains(keyword))
                .Take(pageSize - keywords.Count)
                .ToListAsync());
        }

        return keywords
            .Distinct()
            .OrderBy(i => i.Locale)
            .ThenByDescending(i => i.Used)
            .ThenBy(i => i.Value.IndexOf(keyword, StringComparison.InvariantCultureIgnoreCase))
            .ThenBy(i => i.Value.Length)
            .ToList();
    }
    
    public async Task MergeAsync(Guid keywordMain, Guid keywordAlias)
    {
        var main = await _db.Keywords.FindAsync(keywordMain)
                   ?? throw new ArgumentException($"Keyword with id {keywordMain} not found");

        var alias = await _db.Keywords.FindAsync(keywordAlias)
                    ?? throw new ArgumentException($"Keyword with id {keywordAlias} not found");


        // find affected keyword theses
        var affectedKT = await _db.KeywordThesis
            .Query()
            .Where(i => i.KeywordId == keywordAlias)
            .ToListAsync();

        // extract theses ids
        var affectedTheses = affectedKT.Select(i => i.Thesis).ToList();

        // delete affected keyword theses
        _db.KeywordThesis.RemoveRange(affectedKT);

        // create new keyword theses
        var newKT = affectedTheses
            .Where(i => !i.Keywords.Contains(alias))
            .Select(i => new KeywordThesis { ThesisId = i.Id, KeywordId = main.Id }).ToList();

        // add new keyword theses
        _db.KeywordThesis.AddRange(newKT);

        // delete alias keyword
        _db.Keywords.Remove(alias);

        // save changes
        var info = _db.GetStats();
        await _db.SaveChangesAsync();
    }
}

public class SimilarKeyword
{
    public int Distance { get; set; }
    public double Similarity { get; set; }
    public Keyword Keyword1 { get; set; }
    public Keyword Keyword2 { get; set; }

    public string Locale => Keyword1.Locale;

    public SimilarKeyword(int distance, double similarity, Keyword keyword1, Keyword keyword2)
    {
        Distance = distance;
        Similarity = similarity;
        Keyword1 = keyword1;
        Keyword2 = keyword2;
    }
}
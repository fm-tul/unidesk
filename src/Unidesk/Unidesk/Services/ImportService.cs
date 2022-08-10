using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Services.Stag.Models;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services;

[ExcludeFromCodeCoverage]
public class ImportService
{
    public CachedDbContext Db { get; }

    public ImportService(CachedDbContext db)
    {
        Db = db;
    }

    public async Task<List<Keyword>> CreateNewKeywords(List<string> keywords, string locale)
    {
        var matchedKeywords = Db.Keywords
            .Where(i => keywords.Contains(i.Value) && i.Locale == locale)
            .ToList();

        var newKeywords = keywords
            .Except(matchedKeywords.Select(i => i.Value))
            .Select(i => new Keyword
            {
                Value = i,
                Locale = locale
            })
            .ToList();

        await Db.Keywords
            .AddRangeAsync(newKeywords);

        return newKeywords;
    }

    public async Task<List<KeywordThesis>> GetOrCreateKeywordsLocale(Thesis thesis, string locale, List<string> keywords)
    {
        // create new keywords
        await CreateNewKeywords(keywords, locale);

        // now all keywords are in db (or cached)
        var matchedKeywords = Db.Keywords
            .Where(i => keywords.Contains(i.Value) && i.Locale == locale)
            .ToList();

        var newKeywords = matchedKeywords
            .Where(i => !thesis.KeywordThesis.Any(j => j.KeywordId == i.Id))
            .ToList();

        var newKeywordThesis = newKeywords
            .Select(i => new KeywordThesis { KeywordId = i.Id, ThesisId = thesis.Id })
            .ToList();

        thesis.KeywordThesis.AddRange(newKeywordThesis);

        return newKeywordThesis;
    }

    public async Task<List<KeywordThesis>> GetOrCreateKeywords(Thesis thesis, string? keywordsCzeStr, string? keywordsEngStr)
    {
        // example: aaa,bbb, ccc, ddd,    eee
        var keywordsCze = keywordsCzeStr?
            .Split(',')
            .Select(s => s.Trim())
            .Where(i => !string.IsNullOrEmpty(i))
            .ToList() ?? new List<string>();

        var keywordsEng = keywordsEngStr?
            .Split(',')
            .Select(s => s.Trim())
            .Where(i => !string.IsNullOrEmpty(i))
            .ToList() ?? new List<string>();

        await GetOrCreateKeywordsLocale(thesis, "cze", keywordsCze);
        await GetOrCreateKeywordsLocale(thesis, "eng", keywordsEng);

        var keywords = thesis.KeywordThesis;

        return keywords;
    }

    public async Task<Keyword> GetOrCreateKeyword(string word, string locale)
    {
        return await Db.Keywords
                   .FirstOrDefaultAsync(i => i.Value == word && i.Locale == locale)
               ?? Db.Keywords
                   .AddAndReturn(new Keyword
                   {
                       Value = word,
                       Locale = locale
                   });
    }

    public async Task<Department> GetOrCreateDepartment(string departmentCode)
    {
        return await Db.Departments
                   .FirstOrDefaultAsync(d => d.Code == departmentCode)
               ?? Db.Departments
                   .AddAndReturn(new Department
                   {
                       Code = departmentCode,
                       NameEng = "",
                       NameCze = "",
                   });
    }

    public async Task<Faculty> GetOrCreateFaculty(string facultyCode)
    {
        return await Db.Faculties
                   .FirstOrDefaultAsync(f => f.Code == facultyCode)
               ?? Db.Faculties
                   .AddAndReturn(new Faculty
                   {
                       Code = facultyCode,
                       NameEng = "",
                       NameCze = "",
                   });
    }

    public async Task<SchoolYear> GetOrCreateSchoolYear(int? datumZadaniYear)
    {
        var year = datumZadaniYear ?? DateTime.Now.Year;
        return await Db.SchoolYears
                   .FirstOrDefaultAsync(s => s._start.Year == year)
               ?? Db.SchoolYears
                   .AddAndReturn(new SchoolYear
                   {
                       Start = new DateOnly(year, 1, 1),
                       End = new DateOnly(year, 12, 31),
                   });
    }

    public async Task<ThesisType> GetOrCreateThesisType(string thesisTypeCode)
    {
        return await Db.ThesisTypes
                   .FirstOrDefaultAsync(t => t.Code == thesisTypeCode)
               ?? Db.ThesisTypes
                   .AddAndReturn(new ThesisType
                   {
                       Code = thesisTypeCode,
                       NameCze = "",
                       NameEng = "",
                   });
    }


    public ThesisStatus ParseThesisStatus(string itemStavPrace)
    {
        /* From stag docs:
            R. rozpracovanan prace
            DBPOO. Dodělaná práce zatím bez pokusu o obhajobu.
            
            DBUO. Dodělaná práce, ale neúspěšná obhajoba.
            DUO. Dodělaná práce s úspěšnou obhajobou.
            
            ND. Práce nebyla dokončena
            
            OPUBPOO. Práce byla odevzdána a bez pokusu o obhajobu byla ukončena
            OPUNO. Práce byla odevzdána, neuspěla u obhajoby a byla ukončena
         */

        return itemStavPrace switch
        {
            "R" => ThesisStatus.Assigned,
            "DBPOO" => ThesisStatus.Submitted,
            
            "DBUO" => ThesisStatus.Finished_Unsuccessfully,
            "DUO" => ThesisStatus.Finished_Susccessfully,
            "ND" => ThesisStatus.Abandoned,
            
            "OPUBPOO" => ThesisStatus.Finished,
            "OPUNO" => ThesisStatus.Finished,
            
            _ => ThesisStatus.Unknown
        };
    }

    public async Task<User?> GetOrCreateUser(Student student)
    {
        if (string.IsNullOrWhiteSpace(student.StagId))
        {
            // skip of now
            return null;
        }

        return await Db.Users.FirstOrDefaultAsync(i => i.StagId == student.StagId)
               ?? Db.Users.AddAndReturn(new User()
               {
                   StagId = student.StagId,
                   Username = student.Username,
                   Email = student.Email.ValidEmailOrDefault(),
                   FirstName = student.FirstName,
                   LastName = student.LastName,
                   TitleBefore = student.TitleBefore,
                   TitleAfter = student.TitleAfter,
               });
    }

    public List<User> UpdateUsersList(List<User> currentList, List<User> newList)
    {
        if (currentList.Count != newList.Count)
        {
            return newList;
        }

        for (int i = 0; i < currentList.Count; i++)
        {
            if (currentList[i].Id != newList[i].Id)
            {
                currentList[i] = newList[i];
            }
        }

        return currentList;
    }
}

public static class DbSetExtensions
{
    public static T AddAndReturn<T>(this DbSet<T> dbSet, T entity) where T : class
    {
        dbSet.Add(entity);
        return entity;
    }
}
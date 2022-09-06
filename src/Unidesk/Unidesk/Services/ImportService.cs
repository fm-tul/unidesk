using System.Text.RegularExpressions;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Services.Stag.Models;
using Unidesk.Utils.Extensions;
using Unidesk.Utils.Text;

namespace Unidesk.Services;

public class ImportService
{
    public CachedDbContext Db { get; }
    
    private readonly ILogger<ImportService> _logger;

    public ImportService(CachedDbContext db, ILogger<ImportService> logger)
    {
        Db = db;
        _logger = logger;
    }

    public async Task<List<Keyword>> CreateNewKeywords(List<string> keywords, string locale)
    {
        var matchedKeywords = Db.Keywords
            .Where(i => keywords.ContainsString(i.Value) && i.Locale == locale)
            .ToList();

        var newKeywords = keywords
            .Where(i => !matchedKeywords.Select(j => j.Value).ContainsString(i))
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
        // split by comma or semicolon
        var splitRegex = new Regex(@"[,;]");
        // example: aaa,bbb, ccc, ddd,    eee
        var keywordsCze = splitRegex.Split(keywordsCzeStr ?? "")
            .Select(s => s.RemoveWeirdCharacters().Trim())
            .Where(i => !string.IsNullOrEmpty(i))
            .Distinct()
            .ToList();

        var keywordsEng = splitRegex.Split(keywordsEngStr ?? "")
            .Select(s => s.RemoveWeirdCharacters().Trim())
            .Where(i => !string.IsNullOrEmpty(i))
            .Distinct()
            .ToList();

        await GetOrCreateKeywordsLocale(thesis, "cze", keywordsCze);
        await GetOrCreateKeywordsLocale(thesis, "eng", keywordsEng);

        var keywords = thesis.KeywordThesis;

        return keywords;
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
                   .FirstOrDefaultAsync(t => t.Code == thesisTypeCode || t.NameCze.Contains(thesisTypeCode, StringComparison.InvariantCultureIgnoreCase))
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

    public User? GetOrCreateUserStudent(Student student)
    {
        if (string.IsNullOrWhiteSpace(student.StagId))
        {
            // skip of now
            return null;
        }
        
        var user = Db.Users.FirstOrDefault(i => i.StagId == student.StagId)
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
        
        user.UserFunction |= UserFunction.Author | UserFunction.Guest;
        
        return user;
    }

    public User? GetOrCreateTeacher(string? stagNameLime, string? stagUcitidno, UserFunction userFunction)
    {
        /* Examples: 
            "vedouciUcitidno": "64688",
            "vedouciJmeno": "Hybš Jan, Ing.",
            
            "oponentUcitidno": "55322",
            "oponentJmeno": "Novák Pavel, Ing.",
            
            "vedouciUcitidno": "56318",
            "vedouciJmeno": "Kopetschke Igor, Ing.",
            
            "oponentUcitidno": "68447",
            "oponentJmeno": "Prokop Jan, Ing.",
         */
        if (string.IsNullOrWhiteSpace(stagNameLime) || string.IsNullOrWhiteSpace(stagUcitidno))
        {
            return null;
        }
        
        var existing = Db.Users
            .Where(i => i.StagId == stagUcitidno)
            .ToList();
        
        if (existing.Count > 1)
        {
            _logger.LogError("Found more than one user with stagId {StagUcitidno}", stagUcitidno);
            return null;
        }
        
        if (existing.Count == 1)
        {
            return existing[0];
        }
        
        
        var parts = stagNameLime.Split(',', 2);
        var nameParts = parts[0].Split(' ', 3);
        if (nameParts.Length < 2)
        {
            return null;
        }
        
        var (lastname, middlename, firstname) = nameParts.Length == 3
            ? (nameParts[0], nameParts[1], nameParts[2])
            : (nameParts[0], "", nameParts[1]);

        var titleLine = parts.Length == 2 ? parts[1] : null;
        var (titleBefore, titleAfter) = titleLine.IsNotNullOrEmpty()
            ? TitlesUtils.FormatTitles(TitlesUtils.FindTitles(titleLine))
            : (null, null);

        var newUser = new User
        {
            StagId = stagUcitidno.Value(),
            FirstName = firstname,
            MiddleName = middlename,
            LastName = lastname,
            TitleBefore = titleBefore,
            TitleAfter = titleAfter,
            UserFunction = userFunction,
        };

        return Db.Users.AddAndReturn(newUser);
    }
    

    public async Task<Thesis> GetOrCreateThesis(long adipidno)
    {
        return await Db.Theses.FirstOrDefaultAsync(i => i.Adipidno == adipidno)
               ?? Db.Theses.AddAndReturn(new Thesis { Adipidno = adipidno });
    }
    
    public List<ThesisUser> MergeUsers(Thesis target, params ThesisUser?[] users)
    {
        var validUsers = users
            .Where(i => i != null)
            .OfType<ThesisUser>()
            .ToList();
        
        foreach (var thesisUser in validUsers)
        {
            var existing = target.ThesisUsers.FirstOrDefault(i => i.UserId == thesisUser.UserId);
            // user already there, no need to do anything
            if (existing != null)
            {
                continue;
            }
            
            target.ThesisUsers.Add(thesisUser);
        }

        return target.ThesisUsers;
    }
    // public List<User> UpdateUsersList(List<User> currentList, User? newItem)
    // {
    //     if (newItem == null)
    //     {
    //         return currentList;
    //     }
    //
    //     return UpdateUsersList(currentList, new List<User> { newItem });
    // }
    //
    // public List<User> UpdateUsersList(List<User> currentList, List<User> newList)
    // {
    //     if (currentList.Count != newList.Count)
    //     {
    //         return newList;
    //     }
    //
    //     for (int i = 0; i < currentList.Count; i++)
    //     {
    //         if (currentList[i].Id != newList[i].Id)
    //         {
    //             currentList[i] = newList[i];
    //         }
    //     }
    //
    //     return currentList;
    // }

    public async Task<StudyProgramme> GetOrCreateStudyProgramme(string itemNazevStudProgramu)
    {
        return await Db.StudyProgrammes
                   .FirstOrDefaultAsync(s => s.NameCze == itemNazevStudProgramu || s.NameEng == itemNazevStudProgramu)
               ?? Db.StudyProgrammes
                   .AddAndReturn(new StudyProgramme
                   {
                       NameCze = itemNazevStudProgramu,
                       NameEng = itemNazevStudProgramu,
                   });
    }
}
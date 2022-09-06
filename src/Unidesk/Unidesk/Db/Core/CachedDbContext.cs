using Unidesk.Db.Models;

namespace Unidesk.Db.Core;

public class CachedDbContext
{
    private readonly UnideskDbContext _db;
    public CachedDbSet<SchoolYear> SchoolYears { get; }
    public CachedDbSet<Faculty> Faculties { get; }
    public CachedDbSet<Department> Departments { get; }
    public CachedDbSet<StudyProgramme> StudyProgrammes { get; }

    public CachedDbSet<Document> Documents { get; }
    public CachedDbSet<DocumentContent> DocumentContents { get; }

    public CachedDbSet<Thesis> Theses { get; }
    public CachedDbSet<ThesisOutcome> ThesisOutcomes { get; }
    public CachedDbSet<ThesisReport> ThesisReports { get; }
    public CachedDbSet<ThesisType> ThesisTypes { get; }
    public CachedDbSet<Keyword> Keywords { get; }
    public CachedDbSet<KeywordThesis> KeywordThesis { get; }

    public CachedDbSet<User> Users { get; }
    public CachedDbSet<UserRole> UserRoles { get; }
    public CachedDbSet<ReportUser> ReportUsers { get; }

    public CachedDbSet<Team> Teams { get; }
    public CachedDbSet<UserInTeam> UserInTeams { get; }

    public CachedDbSet<ChangeLog> ChangeLogs { get; }

    public CachedDbContext(UnideskDbContext db)
    {
        _db = db;
        SchoolYears = new CachedDbSet<SchoolYear>(_db.SchoolYears);
        Faculties = new CachedDbSet<Faculty>(_db.Faculties);
        Departments = new CachedDbSet<Department>(_db.Departments);
        StudyProgrammes = new CachedDbSet<StudyProgramme>(_db.StudyProgrammes);

        Documents = new CachedDbSet<Document>(_db.Documents);
        DocumentContents = new CachedDbSet<DocumentContent>(_db.DocumentContents);

        Theses = new CachedDbSet<Thesis>(_db.Theses);
        ThesisOutcomes = new CachedDbSet<ThesisOutcome>(_db.ThesisOutcomes);
        ThesisReports = new CachedDbSet<ThesisReport>(_db.ThesisReports);
        ThesisTypes = new CachedDbSet<ThesisType>(_db.ThesisTypes);
        Keywords = new CachedDbSet<Keyword>(_db.Keywords);
        KeywordThesis = new CachedDbSet<KeywordThesis>(_db.KeywordThesis);

        Users = new CachedDbSet<User>(_db.Users);
        UserRoles = new CachedDbSet<UserRole>(_db.UserRoles);
        ReportUsers = new CachedDbSet<ReportUser>(_db.ReportUsers);

        Teams = new CachedDbSet<Team>(_db.Teams);
        UserInTeams = new CachedDbSet<UserInTeam>(_db.UserInTeams);

        ChangeLogs = new CachedDbSet<ChangeLog>(_db.ChangeLogs);
    }

    public ChangeTrackedStats GetStats() => _db.GetStats();
    public async Task<int> SaveChangesAsync() => await _db.SaveChangesAsync();
    
    public UnideskDbContext GetDbContext() => _db;
}
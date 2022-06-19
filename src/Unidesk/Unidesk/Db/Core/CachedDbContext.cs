using Unidesk.Db.Models;

namespace Unidesk.Db.Core;

public class CachedDbContext
{
    public readonly UnideskDbContext _db;
    public readonly CachedDbSet<SchoolYear> SchoolYears;
    public readonly CachedDbSet<Faculty> Faculties;
    public readonly CachedDbSet<Department> Departments;

    public readonly CachedDbSet<Document> Documents;
    public readonly CachedDbSet<DocumentContent> DocumentContents;

    public readonly CachedDbSet<Thesis> Theses;
    public readonly CachedDbSet<ThesisOutcome> ThesisOutcomes;
    public readonly CachedDbSet<ThesisReport> ThesisReports;
    public readonly CachedDbSet<ThesisType> ThesisTypes;
    public readonly CachedDbSet<Keyword> Keywords;
    public readonly CachedDbSet<KeywordThesis> KeywordThesis;

    public readonly CachedDbSet<User> Users;
    public readonly CachedDbSet<UserRole> UserRoles;
    public readonly CachedDbSet<ReportUser> ReportUsers;

    public readonly CachedDbSet<Team> Teams;
    public readonly CachedDbSet<UserInTeam> UserInTeams;

    public readonly CachedDbSet<ChangeLog> ChangeLogs;
    
    public CachedDbContext(UnideskDbContext db)
    {
        _db = db;
        SchoolYears = new CachedDbSet<SchoolYear>(_db.SchoolYears);
        Faculties = new CachedDbSet<Faculty>(_db.Faculties);
        Departments = new CachedDbSet<Department>(_db.Departments);
        
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
}
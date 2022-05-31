using Microsoft.EntityFrameworkCore;
using Unidesk.Db.Models;

namespace Unidesk.Db;

public class UnideskDbContext : DbContext
{
    public UnideskDbContext(DbContextOptions<UnideskDbContext> options)
        : base(options)
    {
    }

    public DbSet<SchoolYear> SchoolYears { get; set; }
    public DbSet<Faculty> Faculties { get; set; }
    public DbSet<Department> Departments { get; set; }

    public DbSet<Document> Documents { get; set; }
    public DbSet<DocumentContent> DocumentContents { get; set; }

    public DbSet<Thesis> Theses { get; set; }
    public DbSet<ThesisOutcome> ThesisOutcomes { get; set; }
    public DbSet<ThesisReport> ThesisReports { get; set; }
    public DbSet<ThesisType> ThesisTypes { get; set; }

    public DbSet<User> Users { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<ReportUser> ReportUsers { get; set; }

    public DbSet<Team> Teams { get; set; }
    public DbSet<UserInTeam> UserInTeams { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // UserInTeam basically handles m-n relation and we must specify the keys here
        modelBuilder.Entity<UserInTeam>()
            .HasKey(j => new { j.UserId, j.TeamId });
    }
}
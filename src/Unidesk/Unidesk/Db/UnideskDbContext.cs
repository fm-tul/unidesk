using Microsoft.EntityFrameworkCore;
using Unidesk.Db.Models;
using Unidesk.Db.Seeding;

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
        // backing fields
        modelBuilder.Entity<SchoolYear>().Property(e => e._start);
        modelBuilder.Entity<SchoolYear>().Property(e => e._end);

        modelBuilder.Entity<UserRole>()
            .Property(e => e._grants);

        // UserInTeam basically handles m-n relation and we must specify the keys here
        modelBuilder.Entity<UserInTeam>()
            .HasKey(j => new { j.UserId, j.TeamId });
    }

    public async Task SeedDbAsync()
    {
        var info = InitialSeed.Seed(this);

        if (info.TotalRows > 0)
        {
            await SaveChangesAsync();
        }
    }
}

public static class DbSetExtensions {
    public static IEnumerable<T> AddRangeEnumerable<T>(this DbSet<T> dbSet, IEnumerable<T> items) where T: class
    {
        dbSet.AddRange(items);
        return items;
    }
}
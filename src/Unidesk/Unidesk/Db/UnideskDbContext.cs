using Microsoft.EntityFrameworkCore;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Db.Seeding;
using Unidesk.Services;
using Unidesk.Utils;
using Unidesk.Utils.Extensions;

namespace Unidesk.Db;

public class UnideskDbContext : DbContext
{
    private readonly UserProvider _userProvider;
    
    public UnideskDbContext(DbContextOptions<UnideskDbContext> options, UserProvider userProvider)
        : base(options)
    {
        _userProvider = userProvider;
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
    
    public DbSet<ChangeLog> ChangeLogs { get; set; }

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

    public OperationInfo HandleInterceptors()
    {
        var info = new OperationInfo();
        var items = ChangeTracker
            .Entries()
            .Where(i => i.Entity is TrackedEntity)
            .ToList();

        // update Modified, ModifiedBy, Created and CreatedBy
        info += items.Where(i => i.State == EntityState.Added || i.State == EntityState.Modified)
            .ForEach(i =>
            {
                if (i.Entity is TrackedEntity entity)
                {
                    entity.Modified = DateTime.Now;
                    entity.ModifiedBy = _userProvider.CurrentUser?.Email;
                    ChangeLogs.Add(ChangeLog.Create(i, _userProvider.CurrentUser?.Email));

                    if (i.State == EntityState.Added)
                    {
                        entity.Created = DateTime.Now;
                        entity.CreatedBy = _userProvider.CurrentUser?.Email;
                    }
                }
            }).ToList();

        return info;
    }

    public override int SaveChanges()
    {
        HandleInterceptors();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        HandleInterceptors();
        return base.SaveChangesAsync(cancellationToken);
    }
}
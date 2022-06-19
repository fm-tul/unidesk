using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Db.Seeding;
using Unidesk.Services;
using Unidesk.Utils;
using Unidesk.Utils.Extensions;

namespace Unidesk.Db;

public class UnideskDbContext : DbContext
{
    private readonly IUserProvider _userProvider;
    private readonly ILogger<UnideskDbContext> _logger;

    public UnideskDbContext(DbContextOptions<UnideskDbContext> options, IUserProvider userProvider, ILogger<UnideskDbContext> logger)
        : base(options)
    {
        _userProvider = userProvider;
        _logger = logger;
        _logger.LogInformation("UnideskDbContext created");
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
    public DbSet<Keyword> Keywords { get; set; }
    public DbSet<KeywordThesis> KeywordThesis { get; set; }

    public DbSet<User> Users { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<ReportUser> ReportUsers { get; set; }

    public DbSet<Team> Teams { get; set; }
    public DbSet<UserInTeam> UserInTeams { get; set; }
    
    
    public DbSet<ChangeLog> ChangeLogs { get; set; }
    
    private bool _iterceptorsEnabled = true;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // backing fields
        modelBuilder.Entity<SchoolYear>().Property(e => e._start);
        modelBuilder.Entity<SchoolYear>().Property(e => e._end);
        
        modelBuilder.Entity<UserRole>().Property(e => e._grants);

        // UserInTeam basically handles m-n relation and we must specify the keys here
        modelBuilder.Entity<UserInTeam>()
            .HasKey(j => new { j.UserId, j.TeamId });
        
        modelBuilder.Entity<KeywordThesis>()
            .HasKey(j => new { j.KeywordId, j.ThesisId });
    }
    

    public async Task SeedDbAsync()
    {
        _userProvider.CurrentUser = _userProvider.CurrentUser ?? User.InitialSeedUser;
        var info = InitialSeed.Seed(this);

        if (info.TotalRows > 0)
        {
            await SaveChangesAsync();
        }
    }

    public ChangeTrackedStats GetStats()
    {
        ChangeTracker.DetectChanges();
        return new ChangeTrackedStats(ChangeTracker.Entries());
    }

    public OperationInfo HandleInterceptors()
    {
        if (!_iterceptorsEnabled)
        {
            return new OperationInfo("Interceptors: disabled");
        }
        
        var info = new OperationInfo("Interceptors");
        var items = ChangeTracker
            .Entries()
            .Where(i => i.Entity is TrackedEntity)
            .Where(i => i.State == EntityState.Added || i.State == EntityState.Modified)
            .ToList();

        // update Modified, ModifiedBy, Created and CreatedBy
        info += items
            .AsEnumerable()
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
    
    public UnideskDbContext DisableInterceptors()
    {
        _iterceptorsEnabled = false;
        return this;
    }
    
    public UnideskDbContext EnableInterceptors()
    {
        _iterceptorsEnabled = true;
        return this;
    }
}


public class ChangeTrackedStats
{
    public readonly int AddedCount;
    public readonly int ModifiedCount;
    public readonly int DeletedCount;
    public readonly int UnchangedCount;

    public ChangeTrackedStats(IEnumerable<EntityEntry> items)
    {
        var grouped = items.GroupBy(i => i.State).ToDictionary(i => i.Key, i => i.Count());
        AddedCount = grouped.GetValueOrDefault(EntityState.Added, 0);
        ModifiedCount = grouped.GetValueOrDefault(EntityState.Modified, 0);
        DeletedCount = grouped.GetValueOrDefault(EntityState.Deleted, 0);
        UnchangedCount = grouped.GetValueOrDefault(EntityState.Unchanged, 0);
    }

    public override string ToString()
    {
        return $"Added: {AddedCount}, Modified: {ModifiedCount}, Deleted: {DeletedCount}, Unchanged: {UnchangedCount}";
    }
}
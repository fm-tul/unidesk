using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Internal;
using Unidesk.Db.Core;
using Unidesk.Db.Functions;
using Unidesk.Db.Models;
using Unidesk.Db.Models.Internships;
using Unidesk.Db.Models.Reports;
using Unidesk.Db.Seeding;
using Unidesk.Services;
using Unidesk.Utils;
using Unidesk.Utils.Extensions;

namespace Unidesk.Db;

public class UnideskDbContext : DbContext
{
    private readonly IUserProvider _userProvider;
    private readonly ILogger<UnideskDbContext> _logger;
    private readonly IDateTimeService _dateTimeService;

    public UnideskDbContext(DbContextOptions<UnideskDbContext> options, IUserProvider userProvider, ILogger<UnideskDbContext> logger, IDateTimeService dateTimeService)
        : base(options)
    {
        _userProvider = userProvider;
        _logger = logger;
        _dateTimeService = dateTimeService;
    }

    public DbSet<SchoolYear> SchoolYears { get; set; }
    public DbSet<Faculty> Faculties { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<StudyProgramme> StudyProgrammes { get; set; }

    public  DbSet<Document> Documents { get; set; }
    public  DbSet<DocumentContent> DocumentContents { get; set; }

    public  DbSet<Thesis> Theses { get; set; }
    public  DbSet<ThesisOutcome> ThesisOutcomes { get; set; }
    public  DbSet<ThesisReport> ThesisReports { get; set; }
    public  DbSet<ThesisType> ThesisTypes { get; set; }
    public  DbSet<Keyword> Keywords { get; set; }
    public  DbSet<KeywordThesis> KeywordThesis { get; set; }
    public  DbSet<ThesisUser> ThesisUsers { get; set; }

    public  DbSet<User> Users { get; set; }
    public  DbSet<UserRole> UserRoles { get; set; }
    public  DbSet<ReportUser> ReportUsers { get; set; }

    public  DbSet<Team> Teams { get; set; }
    public  DbSet<UserInTeam> UserInTeams { get; set; }
    
    public DbSet<ThesisEvaluation> ThesisEvaluations { get; set; }

    // internship
    public  DbSet<Internship> Internships { get; set; }
    public  DbSet<KeywordInternship> KeywordInternships { get; set; }

    public  DbSet<ChangeLog> ChangeLogs { get; set; }
    public  DbSet<EmailMessage> Emails { get; set; }

    private bool _interceptorsEnabled = true;

    public IEnumerable<string> ModifiedPropertiesFor<TEntity>(TEntity entity) where TEntity: IdEntity
    {
        var changesToEntity = ChangeTracker.Entries<TEntity>()
           .FirstOrDefault(e => e.State == EntityState.Modified && e.Entity.Id == entity.Id);

        if (changesToEntity == null)
        {
            return Array.Empty<string>();
        }
        
        var changedProperties = changesToEntity.Properties
            .Where(p => p.IsModified)
            .Select(p => p.Metadata.Name)
            .ToList();
        
        return changedProperties;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
        {
            relationship.DeleteBehavior = DeleteBehavior.Restrict;
        }

        modelBuilder.Entity<ChangeLog>().OwnsOne(
            i => i.Details, navBuilder =>
            {
                navBuilder.ToJson();
                navBuilder.OwnsMany(j => j.Details);
            });
        
        modelBuilder.Entity<User>().OwnsOne(
            i => i.Preferences, navBuilder =>
            {
                navBuilder.ToJson();
                navBuilder.OwnsMany(j => j.Preferences);
            });
        
        // manually set cascade on delete for certain relations
        modelBuilder.Entity<Document>()
           .HasOne(i => i.DocumentContent)
           .WithOne(i => i.Document)
           .HasForeignKey<DocumentContent>(i => i.DocumentId)
           .OnDelete(DeleteBehavior.Cascade);
        
        /*
         ALTER DATABASE Unidesk_dev
            COLLATE SQL_Latin1_General_CP1_CI_AI
         */
        modelBuilder.UseCollation("SQL_Latin1_General_CP1_CI_AI");
        base.OnModelCreating(modelBuilder);

        // register functions
        modelBuilder
           .HasDbFunction(SQL.LevenshteinMethodInfo())
           .HasName(nameof(SQL.Levenshtein));

        modelBuilder.Entity<User>()
           .HasQueryFilter(i => i.State == StateEntity.Active);
        
        // backing fields
        modelBuilder.Entity<SchoolYear>().Property(e => e._start);
        modelBuilder.Entity<SchoolYear>().Property(e => e._end);
        modelBuilder.Entity<UserRole>().Property(e => e._grantsRaw);

        // UserInTeam basically handles m-n relation and we must specify the keys here
        modelBuilder.Entity<UserInTeam>()
           .HasKey(j => new { j.UserId, j.TeamId });

        modelBuilder.Entity<KeywordThesis>()
           .HasKey(j => new { j.KeywordId, j.ThesisId });

        modelBuilder.Entity<ThesisUser>()
           .HasKey(j => new { j.ThesisId, j.UserId });
        
        modelBuilder.Entity<KeywordInternship>()
           .HasKey(j => new { j.KeywordId, j.InternshipId });
    }


    public async Task<OperationInfo> SeedDbAsync(bool firstTime)
    {
        var info = InitialSeed.Seed(this, firstTime);

        if (info.TotalRows > 0)
        {
            await SaveChangesAsync("system");
        }

        return info;
    }

    public ChangeTrackedStats GetStats(bool detailed = false)
    {
        ChangeTracker.DetectChanges();
        return new ChangeTrackedStats(ChangeTracker.Entries(), detailed);
    }

    public OperationInfo HandleInterceptors(string? currentUser = null)
    {
        if (!_interceptorsEnabled)
        {
            return new OperationInfo("Interceptors: disabled");
        }
        
        var changedBy = currentUser ?? _userProvider.CurrentUser?.Email;

        var info = new OperationInfo("Interceptors");
        var items = ChangeTracker
           .Entries()
           .Where(i => i.Entity is TrackedEntity)
           .Where(i => i.State is EntityState.Added or EntityState.Modified or EntityState.Deleted)
           .ToList();

        // update Modified, ModifiedBy, Created and CreatedBy
        var changeLogs = new List<ChangeLog>();
        info += items
           .AsEnumerable()
           .ForEach(i =>
            {
                if (i.Entity is TrackedEntity entity)
                {
                    entity.Modified = _dateTimeService.Now;
                    entity.ModifiedBy = changedBy;
                    changeLogs.Add(ChangeLog.Create(i, changedBy));

                    if (i.State == EntityState.Added)
                    {
                        entity.Created = _dateTimeService.Now;
                        entity.CreatedBy = changedBy;
                    }
                }
            }).ToList();
        
        // save change logs
        ChangeLogs.AddRange(changeLogs);

        return info;
    }

    public override int SaveChanges()
    {
        HandleInterceptors();
        return base.SaveChanges();
    }
    public  int SaveChanges(string? currentUser)
    {
        HandleInterceptors(currentUser);
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        HandleInterceptors();
        return base.SaveChangesAsync(cancellationToken);
    }
    
    public  Task<int> SaveChangesAsync(string? currentUser, CancellationToken cancellationToken = default)
    {
        HandleInterceptors(currentUser);
        return base.SaveChangesAsync(cancellationToken);
    }
    

    public UnideskDbContext DisableInterceptors()
    {
        _interceptorsEnabled = false;
        return this;
    }

    public UnideskDbContext EnableInterceptors()
    {
        _interceptorsEnabled = true;
        return this;
    }
}

public struct ChangeTrackedStats
{
    public readonly int AddedCount;
    public readonly int ModifiedCount;
    public readonly int DeletedCount;
    public readonly int UnchangedCount;

    public readonly Dictionary<string, Dictionary<EntityState, List<EntityEntry>>> All;

    public ChangeTrackedStats(IEnumerable<EntityEntry> items, bool detailed)
    {
        var entityEntries = items as EntityEntry[] ?? items.ToArray();
        var grouped = entityEntries.GroupBy(i => i.State).ToDictionary(i => i.Key, i => i.Count());
        AddedCount = grouped.GetValueOrDefault(EntityState.Added, 0);
        ModifiedCount = grouped.GetValueOrDefault(EntityState.Modified, 0);
        DeletedCount = grouped.GetValueOrDefault(EntityState.Deleted, 0);
        UnchangedCount = grouped.GetValueOrDefault(EntityState.Unchanged, 0);

        if (detailed)
        {
            var tmp = new Dictionary<string, Dictionary<EntityState, List<EntityEntry>>>();
            foreach (var entity in entityEntries)
            {
                var type = entity.Entity.GetType().Name;
                if (!tmp.ContainsKey(type))
                {
                    tmp.Add(type, new Dictionary<EntityState, List<EntityEntry>>());
                }
                
                if (!tmp[type].ContainsKey(entity.State))
                {
                    tmp[type].Add(entity.State, new List<EntityEntry>());
                }
                
                tmp[type][entity.State].Add(entity);
            }
            
            All = tmp;
        } else
        {
            All = new Dictionary<string, Dictionary<EntityState, List<EntityEntry>>>();
        }
    }

    public override string ToString()
    {
        return $"Added: {AddedCount}, Modified: {ModifiedCount}, Deleted: {DeletedCount}, Unchanged: {UnchangedCount}";
    }
}
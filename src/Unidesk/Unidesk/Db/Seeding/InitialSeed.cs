using Microsoft.EntityFrameworkCore;
using Unidesk.Db.Models;
using Unidesk.Utils;

namespace Unidesk.Db.Seeding;

// public DbSet<SchoolYear> SchoolYears { get; set; }
// public DbSet<Faculty> Faculties { get; set; }
// public DbSet<Department> Departments { get; set; }

// public DbSet<Document> Documents { get; set; }
// public DbSet<DocumentContent> DocumentContents { get; set; }

// public DbSet<Thesis> Theses { get; set; }
// public DbSet<ThesisOutcome> ThesisOutcomes { get; set; }
// public DbSet<ThesisReport> ThesisReports { get; set; }
// public DbSet<ThesisType> ThesisTypes { get; set; }

// public DbSet<User> Users { get; set; }
// public DbSet<UserRole> UserRoles { get; set; }
// public DbSet<ReportUser> ReportUsers { get; set; }

// public DbSet<Team> Teams { get; set; }
// public DbSet<UserInTeam> UserInTeams { get; set; }

public static class InitialSeed
{
    public static OperationInfo Seed(UnideskDbContext db)
    {
        db.Database.EnsureCreated();
        var info = new OperationInfo("Seeding");

        if (!db.SchoolYears.Any())
        {
            info += db.SchoolYears.AddRangeEnumerable(
                Enumerable.Range(2016, 10)
                    .Select(year =>
                        new SchoolYear
                        {
                            Start = new DateOnly(year, 1, 1),
                            End = new DateOnly(year + 1, 1, 1)
                        }
                    )
            );
        }

        if (!db.Faculties.Any())
        {
            var names = new[]
            {
                "Faculty of Mechanical Engineering",
                "Faculty of Textile Engineering",
                "Faculty of Science - Humanities and Education",
                "Faculty of Economics",
                "Faculty of Arts and Architecture",
                "Faculty of Mechatronics Informatics and Interdisciplinary Studies",
                "Faculty of Health Studies",
                "Institute for Nanomaterials, Advanced Technologies and Innovation"
            };

            info += db.Faculties.AddRangeEnumerable(names.Select(name => new Faculty { Name = name }));
        }

        if (!db.Departments.Any())
        {
            var names = new[]
            {
                "Institute of Information Technology and Electronics",
                "Institute of Mechatronics and Computer Engineering",
                "Institute of New Technologies and Applied Informatics",
            };

            info += db.Departments.AddRangeEnumerable(names.Select(name => new Department { Name = name }));
        }

        if (!db.ThesisOutcomes.Any())
        {
            var names = new[]
            {
                "HW product",
                "SW product",
                "FW product",
                "Research",
                "Modelling",
                "Simulation",
                "Measurements",
                "Experimental product",
                "External work"
            };

            info += db.ThesisOutcomes.AddRangeEnumerable(names.Select(name => new ThesisOutcome { Name = name }));
        }

        if (!db.ThesisTypes.Any())
        {
            var names = new[]
            {
                "Bachelor's thesis",
                "Bachelor's project",
                "Master's thesis",
                "Master's project",
                "Doctoral dissertation",
            };

            info += db.ThesisTypes.AddRangeEnumerable(names.Select(name => new ThesisType { Name = name }));
        }

        if (!db.UserRoles.Any())
        {
            var names = new[]
            {
                "Admin",
                "Teacher",
                "Student",
                "Guest"
            };

            info += db.UserRoles.AddRangeEnumerable(names.Select(name => new UserRole { Name = name }));
        }

        var msg = info.DebugMessage();
        return info;
    }
}


public static class DbSetExtensions
{
    public static IEnumerable<T> AddRangeEnumerable<T>(this DbSet<T> dbSet, IEnumerable<T> items) where T : class
    {
        dbSet.AddRange(items);
        return items;
    }
}
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
                ("Faculty of Mechanical Engineering", "Fakulta strojní", "FS"),
                ("Faculty of Textile Engineering", "Fakulta textilní", "FT"),
                ("Faculty of Science - Humanities and Education", "Fakulta přírodovědně-humanitní a pedagogická", "FP"),
                ("Faculty of Economics", "Ekonomická fakulta", "EF"),
                ("Faculty of Arts and Architecture", "Fakulta umění a architektury", "FUA"),
                ("Faculty of Mechatronics Informatics and Interdisciplinary Studies", "Fakulta mechatroniky, informatiky a mezioborových studií", "FM"),
                ("Faculty of Health Studies", "Fakulta zdravotnických studií", "FZS"),
                ("Institute for Nanomaterials, Advanced Technologies and Innovation", "Ústav pro nanomateriály, pokročilé technologie a inovace", "CXI"),
            };

            info += db.Faculties.AddRangeEnumerable(names.Select(name => new Faculty { NameEng = name.Item1, NameCze = name.Item2, Code = name.Item3 }));
        }

        if (!db.Departments.Any())
        {
            var names = new[]
            {
                ("Institute of Information Technology and Electronics", "Ústav informačních technologií a elektroniky", "ITE"),
                ("Institute of Mechatronics and Computer Engineering", "Ústav mechatroniky a technické informatiky ", "MTI"),
                ("Institute of New Technologies and Applied Informatics", "Ústav nových technologií a aplikované informatiky", "NTI"),
            };

            info += db.Departments.AddRangeEnumerable(names.Select(name => new Department { NameEng = name.Item1, NameCze = name.Item2, Code = name.Item3 }));
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
                ("Bachelor's thesis", "Bakalářská práce", "bakalářská"),
                ("Bachelor's project", "Bakalářský projekt", null),
                ("Master's thesis", "Magisterská práce", "diplomová"),
                ("Master's project", "Magisterský projekt", null),
                ("Doctoral dissertation", "Disertační práce", "disertační"),
                ("Rigorous Thesis", "Rigorózní práce", "rigorózní"),
            };

            info += db.ThesisTypes.AddRangeEnumerable(names.Select(name => new ThesisType { NameEng = name.Item1, NameCze = name.Item2, Code = name.Item3 }));
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
    public static List<T> AddRangeEnumerable<T>(this DbSet<T> dbSet, IEnumerable<T> items) where T : class
    {
        var addRangeEnumerable = items.ToList();
        dbSet.AddRange(addRangeEnumerable);
        return addRangeEnumerable;
    }
}
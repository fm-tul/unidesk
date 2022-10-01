using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Unidesk.Db;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Db.Seeding;
using Unidesk.Security;
using Unidesk.Services;
using Unidesk.Services.Stag.Models;
using Xunit;

namespace Unidesk.UnitTests;

public class UnideskDbContextTests
{
    [Fact]
    public async Task Seed_Db()
    {
        var contextOptions = new DbContextOptionsBuilder<UnideskDbContext>()
            .UseInMemoryDatabase("UnideskDbContextTests_Seed_Db")
            .ConfigureWarnings(b => b.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        var loggerSubstitute = Substitute.For<ILogger<UnideskDbContext>>();
        var db = new UnideskDbContext(contextOptions, new UserProvider(), loggerSubstitute, new DefaultDateTimeService());
        db.Departments.Should().BeEmpty();
        db.Faculties.Should().BeEmpty();
        db.Documents.Should().BeEmpty();
        db.Users.Should().BeEmpty();

        await db.SeedDbAsync();

        db.Departments.Should().NotBeEmpty();
        db.Faculties.Should().NotBeEmpty();
        db.Documents.Should().BeEmpty();
        db.Users.Should().BeEmpty();
    }

    [Fact]
    public async Task Interceptor_Should_Be_Called()
    {
        var contextOptions = new DbContextOptionsBuilder<UnideskDbContext>()
            .UseInMemoryDatabase("UnideskDbContextTests_Interceptor_Should_Be_Called")
            .ConfigureWarnings(b => b.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        var userProviderSubstitute = Substitute.For<IUserProvider>();
        userProviderSubstitute.CurrentUser.Returns(new User
        {
            Email = "example@unittest.com"
        });

        // initially empty
        var loggerSubstitute = Substitute.For<ILogger<UnideskDbContext>>();
        var db = new UnideskDbContext(contextOptions, userProviderSubstitute, loggerSubstitute, new DefaultDateTimeService());
        db.Departments.Should().BeEmpty();
        db.Faculties.Should().BeEmpty();
        db.Documents.Should().BeEmpty();
        db.Users.Should().BeEmpty();
        db.ChangeLogs.Should().BeEmpty();

        // interceptors should not find any change logs
        var info = db.HandleInterceptors();
        info.TotalRows.Should().Be(0);

        // seed db
        var seedInfo = InitialSeed.Seed(db);
        seedInfo.TotalRows.Should().NotBe(0);

        // interceptors should find some change logs
        var afterSeedInfo = db.HandleInterceptors();
        afterSeedInfo.TotalRows.Should().NotBe(0);

        // change logs should be empty since we did not call SaveChanges
        db.ChangeLogs.Should().BeEmpty();

        // call SaveChanges
        db.DisableInterceptors();
        await db.SaveChangesAsync();

        // change logs should not be empty since we called SaveChanges
        db.ChangeLogs.Should().NotBeEmpty();

        // interceptors should find correct currrent user
        db.ChangeLogs.All(i => i.User == "example@unittest.com").Should().BeTrue();

        // interceptors should all have some EntityId set
        db.ChangeLogs.All(i => i.EntityId != Guid.Empty).Should().BeTrue();
        db.EnableInterceptors();
    }

    [Fact]
    public async Task Models_Should_Be_Created()
    {
        var contextOptions = new DbContextOptionsBuilder<UnideskDbContext>()
            .UseInMemoryDatabase("UnideskDbContextTests_Models_Should_Be_Created")
            .ConfigureWarnings(b => b.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        var userProviderSubstitute = Substitute.For<IUserProvider>();
        userProviderSubstitute.CurrentUser.Returns(new User()
        {
            Email = "example@unittest.com"
        });
        var loggerSubstitute = Substitute.For<ILogger<UnideskDbContext>>();
        var db = new UnideskDbContext(contextOptions, userProviderSubstitute, loggerSubstitute, new DefaultDateTimeService());
        await db.SeedDbAsync();

        var schoolYear = db.SchoolYears.First();
        var faculty = db.Faculties.First();
        var department = db.Departments.First();
        var thesisOutcome = db.ThesisOutcomes.First();
        var thesisType = db.ThesisTypes.First();
        var userRole = db.UserRoles.First(i => i.Name == "Teacher");
        userRole.Grants = new List<Grant>()
        {
            UserGrants.User_Admin,
            UserGrants.User_Student,
        };

        var userA = new User { Email = "userA@unidesk.com" };
        var userB = new User { Email = "userB@unidesk.com" };
        var userC = new User { Email = "userC@unidesk.com", Roles = new List<UserRole> { userRole } };
        var team = new Team { Name = "Team A", Avatar = string.Empty, Description = string.Empty };
        var userInTeamA = new UserInTeam { User = userA, Team = team, Status = UserInTeamStatus.Accepted };
        var userInTeamB = new UserInTeam { User = userB, Team = team, Status = UserInTeamStatus.Accepted };

        userA.UserInTeams = new List<UserInTeam> { userInTeamA };
        userB.UserInTeams = new List<UserInTeam> { userInTeamB };
        team.UserInTeams = new List<UserInTeam> { userInTeamA, userInTeamB };
        
        var thesisGuid = Guid.NewGuid();
        var thesis = new Thesis
        {
            Id = thesisGuid,
            Adipidno = -1,
            Department = department,
            Faculty = faculty,
            SchoolYear = schoolYear,
            Outcomes = new List<ThesisOutcome> { thesisOutcome },
            ThesisType = thesisType,
            NameEng = "Test thesis",
            NameCze = "Testovací práce",
            Grade = 5,
            ThesisUsers = new List<ThesisUser> { new() {User = userC, ThesisId = thesisGuid} },
            Teams = new List<Team> { team },
            KeywordThesis = new List<KeywordThesis>(),

            Status = ThesisStatus.Draft,
            AbstractEng = "Test abstract",
            AbstractCze = "Testovací abstrakt",
        };


        var document = new Document { Name = "foo.pdf", Extension = "pdf", Size = 1024, ContentType = "application/pdf" };
        var documentContent = new DocumentContent { Document = document };
        var reportUser = new ReportUser();

        var thesisReport = new ThesisReport
        {
            Relation = ThesisReportRelation.Supervisor,
            Thesis = thesis,
            ReportUser = reportUser,
        };

        // TODO: add to db
        var changes = db.GetStats();
        changes.UnchangedCount.Should().BeGreaterThan(0);
        changes.DeletedCount.Should().Be(0);

        db.Theses.Add(thesis);

        changes = db.GetStats();
        changes.AddedCount.Should().BeGreaterThan(1);
        changes.DeletedCount.Should().Be(0);

        db.SaveChanges();

        var theThesis = db.Theses.First();
        theThesis.Should().NotBeNull();
        thesis.KeywordThesis.Should().BeEmpty();

        var cachedDbContext = new CachedDbContext(db);
        var logger = Substitute.For<ILogger<ImportService>>();
        var importService = new ImportService(cachedDbContext, logger);
        theThesis.KeywordThesis = await importService.GetOrCreateKeywords(theThesis, "foo, bar, baz", "foo, bař, baž");
        theThesis.KeywordThesis.Count.Should().Be(3 + 3);

        // no change seconds time
        theThesis.KeywordThesis = await importService.GetOrCreateKeywords(theThesis, "foo, bar, baz", "foo, bař, baž");
        theThesis.KeywordThesis.Count.Should().Be(3 + 3);

        // ignore existing
        theThesis.KeywordThesis = await importService.GetOrCreateKeywords(theThesis, "aaa, bbb,foo", "aaa, bbb,bař");
        theThesis.KeywordThesis.Count.Should().Be(3 + 3 + 2 + 2);


        theThesis.Department = null;
        theThesis.Department = await importService.GetOrCreateDepartment("Test department");
        theThesis.Department.Should().NotBeNull();
        
        theThesis.Faculty = null;
        theThesis.Faculty = await importService.GetOrCreateFaculty("Test faculty");
        theThesis.Faculty.Should().NotBeNull();
        
        theThesis.SchoolYear = null;
        theThesis.SchoolYear = await importService.GetOrCreateSchoolYear(2020);
        theThesis.SchoolYear.Should().NotBeNull();
        
        theThesis.ThesisType = null;
        theThesis.ThesisType = await importService.GetOrCreateThesisType("Test thesis type");
        theThesis.ThesisType.Should().NotBeNull();
        
        theThesis.Status = ThesisStatus.Draft;
        theThesis.Status = importService.ParseThesisStatus("DUO");
        theThesis.Status.Should().Be(ThesisStatus.Finished_Susccessfully);
        theThesis.Status = importService.ParseThesisStatus("Foo");
        theThesis.Status.Should().Be(ThesisStatus.Unknown);

        theThesis.ThesisUsers.Count.Should().Be(1);
        // theThesis.Users.Add(
        //     (await importService.GetOrCreateUserStudent(new Student
        //     {
        //         StagId = "123456",
        //         Email = "foo@tul.cz",
        //         FirstName = "Foo",
        //         LastName = "Bar",
        //         Username = "foo.bar",
        //     }))!
        // );
        // theThesis.Users.Count.Should().Be(2);
        // importService.GetOrCreateUserStudent(new Student()).Result.Should().BeNull();
        //
        // theThesis.Users = importService.UpdateUsersList(theThesis.Users, new List<User>{ userA, userB });
        // theThesis.Users.Count.Should().Be(2);
        // theThesis.Users.First().Id.Should().Be(userA.Id);
        // theThesis.Users.Last().Id.Should().Be(userB.Id);
        //
        // theThesis.Users = importService.UpdateUsersList(theThesis.Users, new List<User>{ userA });
        // theThesis.Users.Count.Should().Be(1);
        // theThesis.Users.First().Id.Should().Be(userA.Id);
    }
}
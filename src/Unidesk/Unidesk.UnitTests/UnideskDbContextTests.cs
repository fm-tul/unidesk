using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using NSubstitute;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Db.Seeding;
using Unidesk.Services;
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

        var db = new UnideskDbContext(contextOptions, new UserProvider());
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
        userProviderSubstitute.CurrentUser.Returns(new User()
        {
            Email = "example@unittest.com"
        });
        
        // initially empty
        var db = new UnideskDbContext(contextOptions, userProviderSubstitute);
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
}
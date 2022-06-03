using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Unidesk.Db;
using Unidesk.Services;
using Xunit;

namespace Unidesk.UnitTests;

public class UnideskDbContextTests
{
    [Fact]
    public async Task Seed_Db()
    {
        var contextOptions = new DbContextOptionsBuilder<UnideskDbContext>()
            .UseInMemoryDatabase("UnideskDbContextTests")
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
}
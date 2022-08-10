using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Server;
using Unidesk.Services;
using Xunit;

namespace Unidesk.UnitTests.Services;

public class UserServiceTests
{
    private readonly IDateTimeService _dateTimeService;
    private readonly UserProvider _userProvider;
    private readonly UnideskDbContext _db;

    public UserServiceTests()
    {
        var contextOptions = new DbContextOptionsBuilder<UnideskDbContext>()
            .UseInMemoryDatabase("UnideskDbContextTests_UserService_Db")
            .ConfigureWarnings(b => b.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        var loggerSubstitute = Substitute.For<ILogger<UnideskDbContext>>();
        _dateTimeService = Substitute.For<IDateTimeService>();
        _userProvider = new UserProvider();
        _db = new UnideskDbContext(contextOptions, _userProvider, loggerSubstitute, _dateTimeService);
    }

    [Fact]
    public async Task Test_Should_Get_User_By_Id()
    {
        var userService = new UserService(_db);
        _db.Users.Add(User.ImportUser);
        _db.Users.Add(User.Guest);
        _db.SaveChanges();
        _db.Users.ToList().Should().HaveCount(2);

        // non existing user
        (await userService.FindUserAsync(Guid.Empty))
            .Should().BeNull();

        // existing user
        var user = (await userService.FindUserAsync(User.ImportUser.Id))!;
        user.Should().NotBeNull();
        user.Id.Should().Be(User.ImportUser.Id);

        var userByRequest = (await userService.FindUserAsync(new LoginRequest { Username = User.ImportUser.Username! }))!;
        userByRequest.Should().NotBeNull();
        userByRequest.Id.Should().Be(User.ImportUser.Id);
    }

    [Fact]
    public void Test_Should_Get_Correct_Claims_For_User()
    {
        var userService = new UserService(_db);
        var claims = userService.GetClaims(User.ImportUser).ToList();
        claims.First(i => i.Type == ClaimTypes.NameIdentifier)
            .Value.Should().Be(User.ImportUser.Id.ToString());

        claims.Where(i => i.Type == "Fingerprint")
            .Should().NotBeNullOrEmpty();

        var claimsGuest = userService.GetClaims(User.Guest).ToList();
        claims.First(i => i.Type == "Fingerprint")
            .Value
            .Should()
            .NotBeSameAs(claimsGuest.First(i => i.Type == "Fingerprint").Value);

        var claimsFingerprint = claims.First(i => i.Type == "Fingerprint");
        var claimsPrincipalSub = Substitute.For<ClaimsPrincipal>();
        claimsPrincipalSub.Claims.Returns(claims);
        claimsPrincipalSub.FindFirst("Fingerprint").Returns(claimsFingerprint);
        
        userService.IsPrincipalValid(claimsPrincipalSub)
            .Should().BeTrue();
    }

    [Fact]
    public async Task Test_Should_Reconstruct_User_From_Claims()
    {
        var userService = new UserService(_db);
        var importUser = userService.FromClaims(new ClaimsObject
        {
            NameIdentifier = User.ImportUser.Id,
            Name = User.ImportUser.Username!,
            Grants = new List<Grant>(),
            Created = DateTime.Now,
        });
        
        importUser.Id.Should().Be(User.ImportUser.Id);
        importUser.Username.Should().Be(User.ImportUser.Username);
    }
}
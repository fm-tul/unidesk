using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Security;
using Unidesk.Server;
using Unidesk.Services;
using Xunit;

namespace Unidesk.UnitTests.Mappings;

public class MappingTests
{
    private readonly IMapper _mapper;
    private readonly IDateTimeService _dateTimeService;
    private readonly UserProvider _userProvider;
    private readonly UnideskDbContext _db;
    private readonly ILogger<UnideskDbContext> _loggerSubstitute;

    public MappingTests()
    {
        _mapper = new Mapper(MapsterConfiguration.CreateMapsterConfig());
        var contextOptions = new DbContextOptionsBuilder<UnideskDbContext>()
           .UseInMemoryDatabase("UnideskDbContextTests_UserService_Mappings_Db")
           .ConfigureWarnings(b => b.Ignore(InMemoryEventId.TransactionIgnoredWarning))
           .Options;
        
        _loggerSubstitute = Substitute.For<ILogger<UnideskDbContext>>();
        _dateTimeService = Substitute.For<IDateTimeService>();
        _userProvider = new UserProvider();
        _db = new UnideskDbContext(contextOptions, _userProvider, _loggerSubstitute, _dateTimeService);
    }
    
    private UserRole roleA = new()
    {
        Id = Guid.NewGuid(),
        Name = "RoleA",
        Grants = new List<Grant>
        {
            Grants.User_Admin.AsGrant(),
            Grants.User_Guest.AsGrant(),
        }
    };
        
    private UserRole roleB = new()
    {
        Id = Guid.NewGuid(),
        Name = "RoleB",
        Grants = new List<Grant>
        {
            Grants.User_Admin.AsGrant(),
            Grants.User_Guest.AsGrant(),
        }
    };
    
    [Fact]
    public void Should_Update_Collection()
    {


        var user = new User
        {
            Roles = new List<UserRole> { roleA, roleB }
        };
        
        _db.DisableInterceptors();
        _db.Users.Add(user);
        // _db.UserRoles.AddRange(roleA, roleB);
        _db.SaveChanges();
        
        _db.UserRoles
           .ToList().Should().HaveCount(2);

        var userDto = _mapper.Map<UserDto>(user);
        userDto.Roles[0].Name = "RoleAChanged";

        var stats1 = _db.GetStats(true);
        
        _mapper.Map(userDto, user);

        var stats2 = _db.GetStats(true);
        
        _db.SaveChanges();
    }

    [Fact]
    public void Should_Update_Entity()
    {
        _db.Database.EnsureDeleted();
        _db.Database.EnsureCreated();
        
        _db.UserRoles.ToList().Should().BeEmpty();
        _db.UserRoles.Add(roleA);
        _db.SaveChanges();
        
        var dto = _mapper.Map<UserRoleDto>(roleA);
        dto.Name = "RoleAChanged";
        
        _mapper.Map(dto, roleA);
        
        var stats = _db.GetStats(true);
        
        _db.SaveChanges();
        
        _db.UserRoles.ToList().Should().HaveCount(1);
        _db.UserRoles.First().Name.Should().Be("RoleAChanged");
    }
    
}
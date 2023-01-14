using System;
using System.Linq;
using FluentAssertions;
using MapsterMapper;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.ReadOnly;
using Unidesk.Server;
using Unidesk.UnitTests.Data;
using Xunit;

namespace Unidesk.UnitTests.Mappings;

public class MapsterTests
{
    private readonly Mapper _mapper;

    public MapsterTests()
    {
        _mapper = new Mapper(MapsterConfiguration.CreateMapsterConfig());
    }
    
    [Fact]
    public void Test_Concrete_Types()
    {
        var dt = new DateTime(2022, 1, 2, 3, 4, 5, DateTimeKind.Utc);
        var dateOnly = _mapper.Map<DateTime, DateOnly>(dt);
        dateOnly.Should().Be(DateOnly.FromDateTime(dt));
        
        var timeOnly = _mapper.Map<DateTime, TimeOnly>(dt);
        timeOnly.Should().Be(TimeOnly.FromDateTime(dt));
        
        // reverse 
        
        var dateOnlyDt = _mapper.Map<DateOnly, DateTime>(dateOnly);
        dateOnlyDt.Should().Be(dt.Date);
        
        var timeOnlyDt = _mapper.Map<TimeOnly, DateTime>(timeOnly);
        timeOnlyDt.TimeOfDay.Should().Be(dt.TimeOfDay);
    }

    [Fact]
    public void Test_UserLookupDto()
    {
        var user = TestUsers.UserA();
        var dto = _mapper.Map<User, UserLookupDto>(user);
        dto.Id.Should().Be(user.Id);
        dto.FullName.Should().Be(user.FullName);
        dto.TitleBefore.Should().Be(user.TitleBefore);
        dto.TitleAfter.Should().Be(user.TitleAfter);
        dto.UserFunction.Should().Be(user.UserFunction);
    }

    [Fact]
    public void Test_UserDto()
    {
        var user = TestUsers.UserA();
        var teamA = TestTeams.TeamA();
        var teamB = TestTeams.TeamB();
        
        user.UserInTeams.Add(new UserInTeam
        {
            User = user,
            Team = teamA,
            UserId = user.Id,
            TeamId = teamA.Id,
            Role = TeamRole.Owner,
        });
        
        user.UserInTeams.Add(new UserInTeam
        {
            User = user,
            Team = teamB,
            UserId = user.Id,
            TeamId = teamB.Id,
            Role = TeamRole.Member,
        });
        
        var dto = _mapper.Map<User, UserDto>(user);
        dto.Id.Should().Be(user.Id);
        dto.FirstName.Should().Be(user.FirstName);
        dto.LastName.Should().Be(user.LastName);
        dto.Email.Should().Be(user.Email);
        dto.TitleBefore.Should().Be(user.TitleBefore);
        dto.TitleAfter.Should().Be(user.TitleAfter);
        dto.UserFunction.Should().Be(user.UserFunction);
        dto.Teams.Should().HaveCount(2);
    }

    [Fact]
    public void Test_ThesisLookupDto()
    {
        var author = TestUsers.UserA();
        var supervisor = TestUsers.UserB();
        var thesis = TestTheses.ThesisA();
        
        thesis.ThesisUsers.Add(new ThesisUser
        {
            Thesis = thesis,
            User = author,
            ThesisId = thesis.Id,
            UserId = author.Id,
            Function = UserFunction.Author,
        });
        
        thesis.ThesisUsers.Add(new ThesisUser
        {
            Thesis = thesis,
            User = supervisor,
            ThesisId = thesis.Id,
            UserId = supervisor.Id,
            Function = UserFunction.Supervisor,
        });
        
        var dto = _mapper.Map<Thesis, ThesisLookupDto>(thesis);
        dto.Id.Should().Be(thesis.Id);
        dto.NameEng.Should().Be(thesis.NameEng);
        dto.NameCze.Should().Be(thesis.NameCze);
        
        dto.Authors.Should().HaveCount(1);
        dto.Authors.First().User.FullName.Should().Be(author.FullName);
        dto.Authors.First().Function.Should().Be(UserFunction.Author);
        
        dto.Supervisors.Should().HaveCount(1);
        dto.Supervisors.First().User.FullName.Should().Be(supervisor.FullName);
        dto.Supervisors.First().Function.Should().Be(UserFunction.Supervisor);
        
        dto.Opponents.Should().BeEmpty();
    }
}
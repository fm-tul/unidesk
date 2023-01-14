using System;
using Unidesk.Db.Models;

namespace Unidesk.UnitTests.Data;

public static class TestTeams
{
    public static Team TeamA() => new()
    {
        Id = Guid.NewGuid(),
        Name = "Team A",
    };

    public static Team TeamB() => new()
    {
        Id = Guid.NewGuid(),
        Name = "Team B",
    };
}

public static class TestUsers
{
    public static User UserA() => new()
    {
        Id = Guid.NewGuid(),
        FirstName = "John",
        LastName = "Doe",
        Email = "foo@bar.com",
        TitleBefore = "Mr",
        TitleAfter = "PhD",
        UserFunction = UserFunction.Teacher | UserFunction.Supervisor,
    };
    
    public static User UserB() => new()
    {
        Id = Guid.NewGuid(),
        FirstName = "Jane",
        LastName = "Doe",
        Email = null,
        TitleBefore = "Mrs",
        TitleAfter = null,
        UserFunction = UserFunction.Opponent,
    };
}

public static class TestTheses
{
    public static Thesis ThesisA() => new()
    {
        Id = Guid.NewGuid(),
        NameEng = "Thesis A",
        NameCze = "Diplomka A",
        AbstractEng = "Description A",
        AbstractCze = "Popis A",
        Status = ThesisStatus.Assigned,
    };
}
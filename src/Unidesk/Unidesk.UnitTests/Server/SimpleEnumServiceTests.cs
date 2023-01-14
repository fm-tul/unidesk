using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using MapsterMapper;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Server;
using Unidesk.Services;
using Unidesk.Services.Enums;
using Xunit;

namespace Unidesk.UnitTests.Server;

public class SimpleEnumServiceTests : IDisposable
{
    private readonly UserProvider _userProvider;
    private readonly UnideskDbContext _db;
    private readonly IMapper _mapper;
    private readonly IDateTimeService _dateTimeService;

    public SimpleEnumServiceTests()
    {
        var contextOptions = new DbContextOptionsBuilder<UnideskDbContext>()
            .UseInMemoryDatabase("UnideskDbContextTests_SimpleEnumService_Db")
            .ConfigureWarnings(b => b.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        var loggerSubstitute = Substitute.For<ILogger<UnideskDbContext>>();
        _dateTimeService = Substitute.For<IDateTimeService>();
        _userProvider = new UserProvider();
        _db = new UnideskDbContext(contextOptions, _userProvider, loggerSubstitute, _dateTimeService);

        _mapper = new Mapper(MapsterConfiguration.CreateMapsterConfig());
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
    }

    [Fact]
    public void GetEnum_Should_Return_Correct_Enum()
    {
        var IOutputCacheStoreSub = Substitute.For<IOutputCacheStore>();
        var service = new SimpleEnumService(_db, _mapper, IOutputCacheStoreSub);
        service.GetAll<Department, DepartmentDto>().Should().BeEmpty();
        var newItems = new[]
        {
            new Department { NameCze = "IT", NameEng = "IT2", Code = "ITA" },
            new Department { NameCze = "HR", NameEng = "HR2", Code = "HRA" },
        };
        _db.Departments.AddRange(newItems);

        _db.SaveChanges();

        var items = service.GetAll<Department, DepartmentDto>();
        items.Should().HaveCount(2);
        items.Should().Contain(x => x.NameCze == "IT");
        items.Should().Contain(x => x.Code == "HRA");

        // compare Ids
        items[0].Id.Should().Be(newItems[0].Id);
        items[1].Id.Should().Be(newItems[1].Id);

        // use mapper
        var dtos = _mapper.Map<List<DepartmentDto>>(items);
        dtos.Should().HaveCount(2);
        dtos.Should().Contain(x => x.NameCze == "IT");
        dtos.Should().Contain(x => x.Code == "HRA");

        // compare Ids
        dtos[0].Id.Should().Be(newItems[0].Id);
        dtos[1].Id.Should().Be(newItems[1].Id);
    }

    [Fact]
    public async Task GetEnum_Should_Update_Enum()
    {
        var IOutputCacheStoreSub = Substitute.For<IOutputCacheStore>();
        var service = new SimpleEnumService(_db, _mapper, IOutputCacheStoreSub);
        var frozenDT = new DateTime(2012, 3, 4);
        _userProvider.CurrentUser = StaticUsers.ImportUser;
        _dateTimeService.Now.Returns(frozenDT);

        var initalDtos = new[]
        {
            new Department { NameCze = "IT", NameEng = "IT2", Code = "ITA", DescriptionEng = "foo" },
            new Department { NameCze = "HR", NameEng = "HR2", Code = "HRA" },
        };

        _db.Departments.ToList().Should().BeEmpty();
        _db.Departments.AddRange(initalDtos);
        _db.Departments.ToList().Should().BeEmpty();
        _db.SaveChanges();
        _db.Departments.ToList().Should().HaveCount(2);

        var dto = new DepartmentDto { NameCze = "Informatika", NameEng = "Informatics", Code = "IT", Id = initalDtos[0].Id };
        var newItem = await service.CreateOrUpdate<Department, DepartmentDto>(dto, CancellationToken.None);

        newItem.Should().NotBeNull();
        newItem.Id.Should().Be(initalDtos[0].Id);
        newItem.NameCze.Should().Be("Informatika");
        newItem.NameEng.Should().Be("Informatics");
        newItem.Code.Should().Be("IT");
        newItem.DescriptionEng.Should().BeNull();
        newItem.ModifiedBy.Should().Be(StaticUsers.ImportUser.Email);
        newItem.Modified.Should().Be(frozenDT);

        var itemFromDb = _db.Departments.FirstOrDefault(x => x.Id == newItem.Id)!;
        itemFromDb.Should().NotBeNull();
        itemFromDb.Id.Should().Be(newItem.Id);
        itemFromDb.NameCze.Should().Be("Informatika");
        itemFromDb.NameEng.Should().Be("Informatics");
        itemFromDb.Code.Should().Be("IT");
        itemFromDb.DescriptionEng.Should().BeNull();
        itemFromDb.ModifiedBy.Should().Be(StaticUsers.ImportUser.Email);
        itemFromDb.Modified.Should().Be(frozenDT);
    }

    [Fact]
    public async Task GetEnum_Should_Create_New_Enum()
    {
        var IOutputCacheStoreSub = Substitute.For<IOutputCacheStore>();
        var service = new SimpleEnumService(_db, _mapper, IOutputCacheStoreSub);
        var frozenDT = new DateTime(2012, 3, 4);
        _userProvider.CurrentUser = StaticUsers.ImportUser;
        _dateTimeService.Now.Returns(frozenDT);

        var initalDtos = new[]
        {
            new Faculty { NameCze = "IT", NameEng = "IT2", Code = "ITA", DescriptionEng = "foo" },
            new Faculty { NameCze = "HR", NameEng = "HR2", Code = "HRA" },
        };

        _db.Faculties.ToList().Should().BeEmpty();
        _db.Faculties.AddRange(initalDtos);
        _db.Faculties.ToList().Should().BeEmpty();
        _db.SaveChanges();
        _db.Faculties.ToList().Should().HaveCount(2);

        var dto = new FacultyDto { NameCze = "Informatika", NameEng = "Informatics", Code = "IT", Id = Guid.Empty };
        var newItem = await service.CreateOrUpdate<Faculty, FacultyDto>(dto, CancellationToken.None);

        newItem.Should().NotBeNull();
        newItem.Id.Should().NotBe(Guid.Empty);
        newItem.NameCze.Should().Be("Informatika");
        newItem.NameEng.Should().Be("Informatics");
        newItem.Code.Should().Be("IT");
        newItem.DescriptionEng.Should().BeNull();
        newItem.ModifiedBy.Should().Be(StaticUsers.ImportUser.Email);
        newItem.Modified.Should().Be(frozenDT);

        var allItems = _db.Faculties.ToList();
        allItems.Should().HaveCount(3);
    }
}
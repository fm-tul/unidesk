using System;
using FluentAssertions;
using MapsterMapper;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Server;
using Xunit;

namespace Unidesk.UnitTests.Dtos;

public class Dtos
{
    
    [Fact]
    public void Test_Should_Convert_Department_To_DepartmentDto()
    {
        var mapper = new Mapper(MapsterConfiguration.CreateMapsterConfig());
        
        var Id = Guid.NewGuid();
        var department = new Department { Id  = Id, NameEng = "Department", NameCze = "Department2", DescriptionCze = "Foobar" };
        
        var departmentDto = mapper.Map<DepartmentDto>(department);
        
        departmentDto.NameCze.Should().Be(department.NameCze);
        departmentDto.NameEng.Should().Be(department.NameEng);
        departmentDto.DescriptionCze.Should().Be(department.DescriptionCze);
        departmentDto.DescriptionEng.Should().BeNull();
        departmentDto.Id.Should().Be(department.Id);
    }
    
    [Fact]
    public void Test_Should_Convert_Faculty_To_FacultyDto()
    {
        var mapper = new Mapper(MapsterConfiguration.CreateMapsterConfig());
        
        var Id = Guid.NewGuid();
        var item = new Faculty { Id = Id, NameEng = "Faculty", NameCze = "Faculty2", DescriptionCze = "Foobar", Code = "AAA"};
        
        var dto = mapper.Map<FacultyDto>(item);
        
        dto.NameCze.Should().Be(item.NameCze);
        dto.NameEng.Should().Be(item.NameEng);
        dto.DescriptionCze.Should().Be(item.DescriptionCze);
        dto.DescriptionEng.Should().BeNull();
        dto.Id.Should().Be(item.Id);
        dto.Code.Should().Be(item.Code);
    }
    
    [Fact]
    public void Test_Should_Convert_ThesisType_To_ThesisTypeDto()
    {
        var mapper = new Mapper(MapsterConfiguration.CreateMapsterConfig());
        
        var Id = Guid.NewGuid();
        var item = new ThesisType { Id = Id, NameEng = "ThesisType", NameCze = "ThesisType2", DescriptionCze = "Foobar", Code = "AAA" };
        
        var dto = mapper.Map<ThesisTypeDto>(item);
        
        dto.NameCze.Should().Be(item.NameCze);
        dto.NameEng.Should().Be(item.NameEng);
        dto.DescriptionCze.Should().Be(item.DescriptionCze);
        dto.DescriptionEng.Should().BeNull();
        dto.Id.Should().Be(item.Id);
        dto.Code.Should().Be(item.Code);
    }
    
    [Fact]
    public void Test_Should_Convert_ThesisOutcome_To_ThesisOutcomeDto()
    {
        var mapper = new Mapper(MapsterConfiguration.CreateMapsterConfig());
        
        var Id = Guid.NewGuid();
        var item = new ThesisOutcome { Id = Id, NameEng = "ThesisOutcome", NameCze = "ThesisOutcome2", DescriptionCze = "Foobar" };
        
        var dto = mapper.Map<ThesisOutcomeDto>(item);
        
        dto.NameCze.Should().Be(item.NameCze);
        dto.NameEng.Should().Be(item.NameEng);
        dto.DescriptionCze.Should().Be(item.DescriptionCze);
        dto.DescriptionEng.Should().BeNull();
        dto.Id.Should().Be(item.Id);
    }
    
    [Fact]
    public void Test_Should_Convert_StudyProgramme_To_StudyProgrammeDto()
    {
        var mapper = new Mapper(MapsterConfiguration.CreateMapsterConfig());
        
        var Id = Guid.NewGuid();
        var item = new StudyProgramme { Id = Id, NameEng = "StudyProgramme", NameCze = "StudyProgramme2", DescriptionCze = "Foobar", Code = "AAA" };
        
        var dto = mapper.Map<StudyProgrammeDto>(item);
        
        dto.NameCze.Should().Be(item.NameCze);
        dto.NameEng.Should().Be(item.NameEng);
        dto.DescriptionCze.Should().Be(item.DescriptionCze);
        dto.DescriptionEng.Should().BeNull();
        dto.Id.Should().Be(item.Id);
        dto.Code.Should().Be(item.Code);
    }
}
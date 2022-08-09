using Microsoft.AspNetCore.Mvc;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Services.Enums;

namespace Unidesk.Server;

public static class MinimalApiExtensions
{
    public static WebApplication AddMinimalApiGetters(this WebApplication app)
    {
        // Faculty
        app.MapGet("/api/enums/Faculty/list",
                ([FromServices] SimpleEnumService s) => s.GetAll<Faculty, FacultyDto>())
            .UseEnumsCachedEndpoint<List<FacultyDto>>($"{nameof(Faculty)}GetAll");

        // Department
        app.MapGet("/api/enums/Department/list",
                ([FromServices] SimpleEnumService s) => s.GetAll<Department, DepartmentDto>())
            .UseEnumsCachedEndpoint<List<DepartmentDto>>($"{nameof(Department)}GetAll");

        // SchoolYear
        app.MapGet("/api/enums/SchoolYear/list",
                ([FromServices] SimpleEnumService s) => s.GetAll<SchoolYear, SchoolYearDto>())
            .UseEnumsCachedEndpoint<List<SchoolYearDto>>($"{nameof(SchoolYear)}GetAll");

        // ThesisOutcome
        app.MapGet("api/enums/ThesisOutcome/list",
                ([FromServices] SimpleEnumService s) => s.GetAll<ThesisOutcome, ThesisOutcomeDto>())
            .UseEnumsCachedEndpoint<List<ThesisOutcomeDto>>($"{nameof(ThesisOutcome)}GetAll");

        // ThesisType
        app.MapGet("api/enums/ThesisType/list",
                ([FromServices] SimpleEnumService s) => s.GetAll<ThesisType, ThesisTypeDto>())
            .UseEnumsCachedEndpoint<List<ThesisTypeDto>>($"{nameof(ThesisType)}GetAll");

        // StudyProgramme
        app.MapGet("api/enums/StudyProgramme/list",
                ([FromServices] SimpleEnumService s) => s.GetAll<StudyProgramme, StudyProgrammeDto>())
            .UseEnumsCachedEndpoint<List<StudyProgrammeDto>>($"{nameof(StudyProgramme)}GetAll");

        return app;
    }

    public static WebApplication AddMinimalApiSetters(this WebApplication app)
    {
        // Faculty
        app.MapPost("/api/enums/Faculty/list",
            ([FromServices] SimpleEnumService s, [FromBody] FacultyDto dto, CancellationToken ct) => s.CreateOrUpdate<Faculty, FacultyDto>(dto, ct))
            .UseEnumsEndpoint<FacultyDto>($"{nameof(Faculty)}CreateOrUpdate");

        // Department
        app.MapPost("/api/enums/Department/list",
            ([FromServices] SimpleEnumService s, [FromBody] DepartmentDto dto, CancellationToken ct) => s.CreateOrUpdate<Department, DepartmentDto>(dto, ct))
            .UseEnumsEndpoint<DepartmentDto>($"{nameof(Department)}CreateOrUpdate");

        // SchoolYear
        app.MapPost("/api/enums/SchoolYear/list",
            ([FromServices] SimpleEnumService s, [FromBody] SchoolYearDto dto, CancellationToken ct) => s.CreateOrUpdate<SchoolYear, SchoolYearDto>(dto, ct))
            .UseEnumsEndpoint<SchoolYearDto>($"{nameof(SchoolYear)}CreateOrUpdate");

        // ThesisOutcome
        app.MapPost("api/enums/ThesisOutcome/list",
            ([FromServices] SimpleEnumService s, [FromBody] ThesisOutcomeDto dto, CancellationToken ct) => s.CreateOrUpdate<ThesisOutcome, ThesisOutcomeDto>(dto, ct))
            .UseEnumsEndpoint<ThesisOutcomeDto>($"{nameof(ThesisOutcome)}CreateOrUpdate");

        // ThesisType
        app.MapPost("api/enums/ThesisType/list",
            ([FromServices] SimpleEnumService s, [FromBody] ThesisTypeDto dto, CancellationToken ct) => s.CreateOrUpdate<ThesisType, ThesisTypeDto>(dto, ct))
            .UseEnumsEndpoint<ThesisTypeDto>($"{nameof(ThesisType)}CreateOrUpdate");
        
        // StudyProgramme
        app.MapPost("api/enums/StudyProgramme/list",
            ([FromServices] SimpleEnumService s, [FromBody] StudyProgrammeDto dto, CancellationToken ct) => s.CreateOrUpdate<StudyProgramme, StudyProgrammeDto>(dto, ct))
            .UseEnumsEndpoint<StudyProgrammeDto>($"{nameof(StudyProgramme)}CreateOrUpdate");
        
        return app;
    }
}
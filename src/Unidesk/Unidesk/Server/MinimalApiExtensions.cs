using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Services.Enums;
using Unidesk.Validations;

namespace Unidesk.Server;


public static class ApiConfig
{
    public const string GET_ALL = "GetAll";
    public const string UPSERT = "Upsert";
    public const string DELETE = "Delete";
}

public static class MinimalApiExtensions
{
    public static WebApplication AddMinimalApiGetters(this WebApplication app)
    {
        // Faculty
        app.MapGet("/api/enums/FacultyGetAll",
                ([FromServices] SimpleEnumService s) => s.GetAll<Faculty, FacultyDto>())
            .UseEnumsCachedEndpoint<List<FacultyDto>>($"{nameof(Faculty)}{ApiConfig.GET_ALL}");

        // Department
        app.MapGet("/api/enums/DepartmentGetAll",
                ([FromServices] SimpleEnumService s) => s.GetAll<Department, DepartmentDto>())
            .UseEnumsCachedEndpoint<List<DepartmentDto>>($"{nameof(Department)}{ApiConfig.GET_ALL}");

        // SchoolYear
        app.MapGet("/api/enums/SchoolYearGetAll",
                ([FromServices] SimpleEnumService s) => s.GetAll<SchoolYear, SchoolYearDto>().OrderBy(i => i.Start))
            .UseEnumsCachedEndpoint<List<SchoolYearDto>>($"{nameof(SchoolYear)}{ApiConfig.GET_ALL}");

        // ThesisOutcome
        app.MapGet("api/enums/ThesisOutcomeGetAll",
                ([FromServices] SimpleEnumService s) => s.GetAll<ThesisOutcome, ThesisOutcomeDto>())
            .UseEnumsCachedEndpoint<List<ThesisOutcomeDto>>($"{nameof(ThesisOutcome)}{ApiConfig.GET_ALL}");

        // ThesisType
        app.MapGet("api/enums/ThesisTypeGetAll",
                ([FromServices] SimpleEnumService s) => s.GetAll<ThesisType, ThesisTypeDto>())
            .UseEnumsCachedEndpoint<List<ThesisTypeDto>>($"{nameof(ThesisType)}{ApiConfig.GET_ALL}");

        // StudyProgramme
        app.MapGet("api/enums/StudyProgrammeGetAll",
                ([FromServices] SimpleEnumService s) => s.GetAll<StudyProgramme, StudyProgrammeDto>())
            .UseEnumsCachedEndpoint<List<StudyProgrammeDto>>($"{nameof(StudyProgramme)}{ApiConfig.GET_ALL}");

        return app;
    }

    public static WebApplication AddMinimalApiSetters(this WebApplication app)
    {
        // Faculty
        app.MapPost("/api/enums/FacultyUpsertOne",
                ([FromServices] SimpleEnumService s, [FromBody] FacultyDto dto, CancellationToken ct) => s.CreateOrUpdate<Faculty, FacultyDto>(dto, ct))
            .UseEnumsEndpoint<FacultyDto>($"{nameof(Faculty)}{ApiConfig.UPSERT}");

        // Department
        app.MapPost("/api/enums/DepartmentUpsertOne",
                ([FromServices] SimpleEnumService s, [FromBody] DepartmentDto dto, CancellationToken ct) =>
                    s.CreateOrUpdate<Department, DepartmentDto, DepartmentDtoValidation>(dto, ct))
            .UseEnumsEndpoint<DepartmentDto>($"{nameof(Department)}{ApiConfig.UPSERT}");

        // SchoolYear
        app.MapPost("/api/enums/SchoolYearUpsertOne",
                ([FromServices] SimpleEnumService s, [FromBody] SchoolYearDto dto, CancellationToken ct) =>
                    s.CreateOrUpdate<SchoolYear, SchoolYearDto, SchoolYearDtoValidation>(dto, ct))
            .UseEnumsEndpoint<SchoolYearDto>($"{nameof(SchoolYear)}{ApiConfig.UPSERT}");

        // ThesisOutcome
        app.MapPost("api/enums/ThesisOutcomeUpsertOne",
                ([FromServices] SimpleEnumService s, [FromBody] ThesisOutcomeDto dto, CancellationToken ct) =>
                    s.CreateOrUpdate<ThesisOutcome, ThesisOutcomeDto, ThesisOutcomeDtoValidation>(dto, ct))
            .UseEnumsEndpoint<ThesisOutcomeDto>($"{nameof(ThesisOutcome)}{ApiConfig.UPSERT}");

        // ThesisType
        app.MapPost("api/enums/ThesisTypeUpsertOne",
                ([FromServices] SimpleEnumService s, [FromBody] ThesisTypeDto dto, CancellationToken ct) =>
                    s.CreateOrUpdate<ThesisType, ThesisTypeDto, ThesisTypeDtoValidation>(dto, ct))
            .UseEnumsEndpoint<ThesisTypeDto>($"{nameof(ThesisType)}{ApiConfig.UPSERT}");

        // StudyProgramme
        app.MapPost("api/enums/StudyProgrammeUpsertOne",
                ([FromServices] SimpleEnumService s, [FromBody] StudyProgrammeDto dto, CancellationToken ct) =>
                    s.CreateOrUpdate<StudyProgramme, StudyProgrammeDto, StudyProgrammeDtoValidation>(dto, ct))
            .UseEnumsEndpoint<StudyProgrammeDto>($"{nameof(StudyProgramme)}{ApiConfig.UPSERT}");

        return app;
    }

    public static WebApplication AddMinimalApiDeleters(this WebApplication app)
    {
        // Faculty
        app.MapDelete("/api/enums/FacultyDeleteOne/{id}",
                ([FromServices] SimpleEnumService s, [FromRoute] Guid id, CancellationToken ct) => s.Delete<Faculty>(id, ct))
            .UseEnumsEndpoint<SimpleJsonResponse>($"{nameof(Faculty)}{ApiConfig.DELETE}");

        // Department
        app.MapDelete("/api/enums/DepartmentDeleteOne/{id}",
                ([FromServices] SimpleEnumService s, [FromRoute] Guid id, CancellationToken ct) => s.Delete<Department>(id, ct))
            .UseEnumsEndpoint<SimpleJsonResponse>($"{nameof(Department)}{ApiConfig.DELETE}");

        // SchoolYear
        app.MapDelete("/api/enums/SchoolYearDeleteOne/{id}",
                ([FromServices] SimpleEnumService s, [FromRoute] Guid id, CancellationToken ct) => s.Delete<SchoolYear>(id, ct))
            .UseEnumsEndpoint<SimpleJsonResponse>($"{nameof(SchoolYear)}{ApiConfig.DELETE}");

        // ThesisOutcome
        app.MapDelete("api/enums/ThesisOutcomeDeleteOne/{id}",
                ([FromServices] SimpleEnumService s, [FromRoute] Guid id, CancellationToken ct) => s.Delete<ThesisOutcome>(id, ct))
            .UseEnumsEndpoint<SimpleJsonResponse>($"{nameof(ThesisOutcome)}{ApiConfig.DELETE}");

        // ThesisType
        app.MapDelete("api/enums/ThesisTypeDeleteOne/{id}",
                ([FromServices] SimpleEnumService s, [FromRoute] Guid id, CancellationToken ct) => s.Delete<ThesisType>(id, ct))
            .UseEnumsEndpoint<SimpleJsonResponse>($"{nameof(ThesisType)}{ApiConfig.DELETE}");

        // StudyProgramme
        app.MapDelete("api/enums/StudyProgrammeDeleteOne/{id}",
                ([FromServices] SimpleEnumService s, [FromRoute] Guid id, CancellationToken ct) => s.Delete<StudyProgramme>(id, ct))
            .UseEnumsEndpoint<SimpleJsonResponse>($"{nameof(StudyProgramme)}{ApiConfig.DELETE}");

        return app;
    }
}
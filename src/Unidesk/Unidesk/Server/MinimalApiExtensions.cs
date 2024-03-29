﻿using Microsoft.AspNetCore.Mvc;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Security;
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
    public static RouteGroupBuilder AddMinimalApiGetters(this RouteGroupBuilder route)
    {
        var getRoute = route.MapGroup("")
           .AllowAnonymous();
        
        // Faculty
        getRoute.MapGet("FacultyGetAll",
                ([FromServices] SimpleEnumService s) => s.GetAll<Faculty, FacultyDto>())
            .UseEnumsCachedEndpoint<List<FacultyDto>>($"{nameof(Faculty)}{ApiConfig.GET_ALL}");

        // Department
        getRoute.MapGet("DepartmentGetAll",
                ([FromServices] SimpleEnumService s) => s.GetAll<Department, DepartmentDto>())
            .UseEnumsCachedEndpoint<List<DepartmentDto>>($"{nameof(Department)}{ApiConfig.GET_ALL}");

        // SchoolYear
        getRoute.MapGet("SchoolYearGetAll",
                ([FromServices] SimpleEnumService s) => s.GetAll<SchoolYear, SchoolYearDto>().OrderBy(i => i.Start))
            .UseEnumsCachedEndpoint<List<SchoolYearDto>>($"{nameof(SchoolYear)}{ApiConfig.GET_ALL}");

        // ThesisOutcome
        getRoute.MapGet("ThesisOutcomeGetAll",
                ([FromServices] SimpleEnumService s) => s.GetAll<ThesisOutcome, ThesisOutcomeDto>())
            .UseEnumsCachedEndpoint<List<ThesisOutcomeDto>>($"{nameof(ThesisOutcome)}{ApiConfig.GET_ALL}");

        // ThesisType
        getRoute.MapGet("ThesisTypeGetAll",
                ([FromServices] SimpleEnumService s) => s.GetAll<ThesisType, ThesisTypeDto>())
            .UseEnumsCachedEndpoint<List<ThesisTypeDto>>($"{nameof(ThesisType)}{ApiConfig.GET_ALL}");

        // StudyProgramme
        getRoute.MapGet("StudyProgrammeGetAll",
                ([FromServices] SimpleEnumService s) => s.GetAll<StudyProgramme, StudyProgrammeDto>())
            .UseEnumsCachedEndpoint<List<StudyProgrammeDto>>($"{nameof(StudyProgramme)}{ApiConfig.GET_ALL}");
        
        // UserRole
        getRoute.MapGet("UserRoleGetAll",
                ([FromServices] SimpleEnumService s) => s.GetAll<UserRole, UserRoleDto>())
            .UseEnumsCachedEndpoint<List<UserRoleDto>>($"{nameof(UserRole)}{ApiConfig.GET_ALL}");

        return getRoute;
    }

    public static RouteGroupBuilder AddMinimalApiSetters(this RouteGroupBuilder app)
    {
        // Faculty
        app.MapPost("FacultyUpsertOne",
                ([FromServices] SimpleEnumService s, [FromBody] FacultyDto dto, CancellationToken ct) => s.CreateOrUpdate<Faculty, FacultyDto>(dto, ct))
            .UseEnumsEndpoint<FacultyDto>($"{nameof(Faculty)}{ApiConfig.UPSERT}", Grants.Manage_Faculties);

        // Department
        app.MapPost("DepartmentUpsertOne",
                ([FromServices] SimpleEnumService s, [FromBody] DepartmentDto dto, CancellationToken ct) =>
                    s.CreateOrUpdate<Department, DepartmentDto, DepartmentDtoValidation>(dto, ct))
            .UseEnumsEndpoint<DepartmentDto>($"{nameof(Department)}{ApiConfig.UPSERT}", Grants.Manage_Departments);

        // SchoolYear
        app.MapPost("SchoolYearUpsertOne",
                ([FromServices] SimpleEnumService s, [FromBody] SchoolYearDto dto, CancellationToken ct) =>
                    s.CreateOrUpdate<SchoolYear, SchoolYearDto, SchoolYearDtoValidation>(dto, ct))
            .UseEnumsEndpoint<SchoolYearDto>($"{nameof(SchoolYear)}{ApiConfig.UPSERT}", Grants.Manage_SchoolYears);

        // ThesisOutcome
        app.MapPost("ThesisOutcomeUpsertOne",
                ([FromServices] SimpleEnumService s, [FromBody] ThesisOutcomeDto dto, CancellationToken ct) =>
                    s.CreateOrUpdate<ThesisOutcome, ThesisOutcomeDto, ThesisOutcomeDtoValidation>(dto, ct))
            .UseEnumsEndpoint<ThesisOutcomeDto>($"{nameof(ThesisOutcome)}{ApiConfig.UPSERT}", Grants.Manage_ThesisOutcomes);

        // ThesisType
        app.MapPost("ThesisTypeUpsertOne",
                ([FromServices] SimpleEnumService s, [FromBody] ThesisTypeDto dto, CancellationToken ct) =>
                    s.CreateOrUpdate<ThesisType, ThesisTypeDto, ThesisTypeDtoValidation>(dto, ct))
            .UseEnumsEndpoint<ThesisTypeDto>($"{nameof(ThesisType)}{ApiConfig.UPSERT}", Grants.Manage_ThesisTypes);

        // StudyProgramme
        app.MapPost("StudyProgrammeUpsertOne",
                ([FromServices] SimpleEnumService s, [FromBody] StudyProgrammeDto dto, CancellationToken ct) =>
                    s.CreateOrUpdate<StudyProgramme, StudyProgrammeDto, StudyProgrammeDtoValidation>(dto, ct))
            .UseEnumsEndpoint<StudyProgrammeDto>($"{nameof(StudyProgramme)}{ApiConfig.UPSERT}", Grants.Manage_StudyProgrammes);
        
        // UserRole
        app.MapPost("UserRoleUpsertOne",
                ([FromServices] SimpleEnumService s, [FromBody] UserRoleDto dto, CancellationToken ct) =>
                    s.CreateOrUpdate<UserRole, UserRoleDto, UserRoleDtoValidation>(dto, ct))
            .UseEnumsEndpoint<UserRoleDto>($"{nameof(UserRole)}{ApiConfig.UPSERT}", Grants.Manage_UserRoles);

        return app;
    }

    public static RouteGroupBuilder AddMinimalApiDeleters(this RouteGroupBuilder app)
    {
        // Faculty
        app.MapDelete("FacultyDeleteOne/{id}",
                ([FromServices] SimpleEnumService s, [FromRoute] Guid id, CancellationToken ct) => s.Delete<Faculty>(id, ct))
            .UseEnumsEndpoint<SimpleJsonResponse>($"{nameof(Faculty)}{ApiConfig.DELETE}");

        // Department
        app.MapDelete("DepartmentDeleteOne/{id}",
                ([FromServices] SimpleEnumService s, [FromRoute] Guid id, CancellationToken ct) => s.Delete<Department>(id, ct))
            .UseEnumsEndpoint<SimpleJsonResponse>($"{nameof(Department)}{ApiConfig.DELETE}");

        // SchoolYear
        app.MapDelete("SchoolYearDeleteOne/{id}",
                ([FromServices] SimpleEnumService s, [FromRoute] Guid id, CancellationToken ct) => s.Delete<SchoolYear>(id, ct))
            .UseEnumsEndpoint<SimpleJsonResponse>($"{nameof(SchoolYear)}{ApiConfig.DELETE}");

        // ThesisOutcome
        app.MapDelete("ThesisOutcomeDeleteOne/{id}",
                ([FromServices] SimpleEnumService s, [FromRoute] Guid id, CancellationToken ct) => s.Delete<ThesisOutcome>(id, ct))
            .UseEnumsEndpoint<SimpleJsonResponse>($"{nameof(ThesisOutcome)}{ApiConfig.DELETE}");

        // ThesisType
        app.MapDelete("ThesisTypeDeleteOne/{id}",
                ([FromServices] SimpleEnumService s, [FromRoute] Guid id, CancellationToken ct) => s.Delete<ThesisType>(id, ct))
            .UseEnumsEndpoint<SimpleJsonResponse>($"{nameof(ThesisType)}{ApiConfig.DELETE}");

        // StudyProgramme
        app.MapDelete("StudyProgrammeDeleteOne/{id}",
                ([FromServices] SimpleEnumService s, [FromRoute] Guid id, CancellationToken ct) => s.Delete<StudyProgramme>(id, ct))
            .UseEnumsEndpoint<SimpleJsonResponse>($"{nameof(StudyProgramme)}{ApiConfig.DELETE}");
        
        // UserRole
        app.MapDelete("UserRoleDeleteOne/{id}",
                ([FromServices] SimpleEnumService s, [FromRoute] Guid id, CancellationToken ct) => s.Delete<UserRole>(id, ct))
            .UseEnumsEndpoint<SimpleJsonResponse>($"{nameof(UserRole)}{ApiConfig.DELETE}");

        return app;
    }
}
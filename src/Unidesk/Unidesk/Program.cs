using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using Unidesk.Client;
using Unidesk.Configurations;
using Unidesk.Db;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.Resolvers;
using Unidesk.Security;
using Unidesk.Server;
using Unidesk.ServiceFilters;
using Unidesk.Services;
using Unidesk.Services.Stag;
using Unidesk.Utils;


var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

// optionally add appsettings.secret.{username}.json which is ignored
var configuration = builder.Configuration
    .AddJsonFile($"appsettings.secret.{Environment.UserName}.json", true)
    .Build();


services.AddEndpointsApiExplorer();
services.AddSwaggerGen(options =>
{
    options.UseAllOfForInheritance();
    options.EnableAnnotations(enableAnnotationsForInheritance: true, enableAnnotationsForPolymorphism: true);
    // options.UseOneOfForPolymorphism();
});

// scoped
services.AddScoped<CryptographyUtils>();
services.AddScoped<StagService>();
services.AddScoped<ImportService>();
services.AddScoped<RequireGrantFilter>();
services.AddScoped<IUserProvider, UserProvider>();
services.AddScoped<UserService>();

// mapper
services.AddAutoMapper(options =>
{
    options.CreateMap<IdEntity, IdEntityDto>();
    options.CreateMap<TrackedEntity, TrackedEntityDto>();

    options.CreateMap<Department, DepartmentDto>();
    options.CreateMap<DepartmentDto, Department>();
    options.CreateMap<Faculty, FacultyDto>();
    options.CreateMap<ThesisType, ThesisTypeDto>();
    options.CreateMap<ThesisOutcome, ThesisOutcomeDto>();
    options.CreateMap<StudyProgramme, StudyProgrammeDto>();

    options.CreateMap<SchoolYear, SchoolYearDto>()
        .ForMember(i => i.Start, i => i.MapFrom(j => j._start))
        .ForMember(i => i.End, i => i.MapFrom(j => j._end));

    options.CreateMap<User, UserDto>()
        .ForMember(i => i.Grants, i => i.MapFrom(j => j.Roles.SelectMany(k => k.Grants).Select(k => k.Id)));

    options.CreateMap<KeywordThesis, KeywordThesisDto>()
        .ForMember(i => i.Keyword, i => i.MapFrom(j => j.Keyword.Value))
        .ForMember(i => i.Locale, i => i.MapFrom(j => j.Keyword.Locale));

    options.CreateMap<Thesis, ThesisDto>()
        .ForMember(i => i.KeywordThesis, i => i.MapFrom(j => j.KeywordThesis))
        .ForMember(i => i.Guidelines, i => i.MapFrom<ThesisGuidelinesResolver>())
        .ForMember(i => i.Literature, i => i.MapFrom<ThesisLiteratureResolver>());

    options.CreateMap<Keyword, KeywordDto>()
        .ForMember(i => i.Used, opt => opt.MapFrom(i => i.KeywordThesis.Count));
}, typeof(Program));


// configs
var appOptions = configuration.GetSection(nameof(AppOptions)).Get<AppOptions>()!;
var connectionString = configuration.GetConnectionString(nameof(UnideskDbContext))!;

// singleton
services.AddSingleton(appOptions);

// extra
services.AddControllersWithFilters();
services.AddDevCors();
services.AddHttpContextAccessor();
services.AddCookieAuthentication();
services.AddDbContext<UnideskDbContext>(options => options.UseSqlServer(connectionString));
services.AddScoped<CachedDbContext>();
services.AddDatabaseDeveloperPageExceptionFilter();
services.AddOutputCache();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.GenerateModels<Program>(Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "Unidesk.Client", "src", "api-client", "constants")));
}

app.UseExceptionHandler();
await app.MigrateDbAsync();


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.UseOutputCache();
app.MapControllers();


// Faculty
app.MapGet("/api/enums/Faculty/list",
        [RequireGrant(UserGrants.User_Guest_Id)]
        ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => db.Faculties.ToList())
    .UseEnumsCachedEndpoint<List<Faculty>>(nameof(Faculty));

// Department
app.MapGet("/api/enums/Department/list",
        ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => mapper.Map<List<DepartmentDto>>(db.Departments.ToList()))
    .UseEnumsCachedEndpoint<List<DepartmentDto>>(nameof(Department));
app.MapPost("/api/enums/Department/edit", async ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper, [FromServices] IOutputCacheStore cache, [FromBody] DepartmentDto dto, CancellationToken ct) =>
        {
            var isInew = dto.Id == Guid.Empty;
            Department entity;
            if (isInew)
            {
                entity = mapper.Map<Department>(dto);
                entity.Id = Guid.NewGuid();
                db.Departments.Add(entity);
            }
            else
            {
                entity = await db.Departments.FindAsync(dto.Id)
                    ?? throw new Exception($"Department with id {dto.Id} not found");
                mapper.Map(dto, entity);
            }

            await db.SaveChangesAsync(ct);
            await cache.EvictByTagAsync(EnumsCachedEndpoint.EnumsCacheTag, ct);
            return mapper.Map<DepartmentDto>(entity);
        })
    .UseEnumsCachedEndpoint<DepartmentDto>($"{nameof(Department)}Edit");

// SchoolYear
app.MapGet("/api/enums/SchoolYear/list",
        ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => mapper.Map<List<SchoolYearDto>>(db.SchoolYears.ToList()))
    .UseEnumsCachedEndpoint<List<SchoolYearDto>>(nameof(SchoolYear));

// ThesisOutcome
app.MapGet("api/enums/ThesisOutcome/list",
        ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => mapper.Map<List<ThesisOutcomeDto>>(db.ThesisOutcomes.ToList()))
    .UseEnumsCachedEndpoint<List<ThesisOutcomeDto>>(nameof(ThesisOutcome));

// ThesisType
app.MapGet("api/enums/ThesisType/list", ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => db.ThesisTypes.ToList())
    .UseEnumsCachedEndpoint<List<ThesisType>>(nameof(ThesisType));

// StudyProgramme
app.MapGet("api/enums/StudyProgramme/list",
        ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => mapper.Map<List<StudyProgrammeDto>>(db.StudyProgrammes.ToList()))
    .UseEnumsCachedEndpoint<List<StudyProgrammeDto>>(nameof(StudyProgramme));

// all enums
app.MapGet("api/enum/All/list", ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => new EnumsDto
    {
        Departments = mapper.Map<List<DepartmentDto>>(db.Departments.ToList()),
        Faculties = mapper.Map<List<FacultyDto>>(db.Faculties.ToList()),
        SchoolYears = mapper.Map<List<SchoolYearDto>>(db.SchoolYears.ToList()),
        ThesisOutcomes = mapper.Map<List<ThesisOutcomeDto>>(db.ThesisOutcomes.ToList()),
        ThesisTypes = mapper.Map<List<ThesisTypeDto>>(db.ThesisTypes.ToList()),
        StudyProgrammes = mapper.Map<List<StudyProgrammeDto>>(db.StudyProgrammes.ToList())
    })
    .UseEnumsCachedEndpoint<EnumsDto>("AllEnums");


app.MapGet("api/enum/Cache/reset", async ([FromServices] IOutputCacheStore cache, CancellationToken ct) =>
    {
        await cache.EvictByTagAsync(EnumsCachedEndpoint.EnumsCacheTag, ct);
        return new { Success = true };
    });

app.Run();
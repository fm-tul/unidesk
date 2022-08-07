using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Unidesk;
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

// singleton
services.AddSingleton(configuration.GetSection(nameof(AppOptions)).Get<AppOptions>());


// extra
services.AddControllersWithFilters();
services.AddDevCors();
services.AddHttpContextAccessor();
services.AddCookieAuthentication();
services.AddDbContext<UnideskDbContext>(options => options.UseSqlServer(configuration.GetConnectionString(nameof(UnideskDbContext))));
services.AddScoped<CachedDbContext>();
services.AddDatabaseDeveloperPageExceptionFilter();


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
app.UseMiddleware<RequireGrantFilter>();


app.MapControllers();

// Faculty
app.MapGet("/api/enums/Faculty/list",
        [RequireGrant(UserGrants.User_Guest_Id)]
        ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => db.Faculties.ToList())
    .WithTags(new[] { "Enums" })
    .WithName(nameof(Faculty))
    .Produces<List<Faculty>>();

// Department
app.MapGet("/api/enums/Department/list",
        ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => mapper.Map<List<DepartmentDto>>(db.Departments.ToList()))
    .WithTags(new[] { "Enums" })
    .WithName(nameof(Department))
    .Produces<List<DepartmentDto>>();

// SchoolYear
app.MapGet("/api/enums/SchoolYear/list",
        ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => mapper.Map<List<SchoolYearDto>>(db.SchoolYears.ToList()))
    .WithTags(new[] { "Enums" })
    .WithName(nameof(SchoolYear))
    .Produces<List<SchoolYearDto>>();

// ThesisOutcome
app.MapGet("api/enums/ThesisOutcome/list",
        ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => mapper.Map<List<ThesisOutcomeDto>>(db.ThesisOutcomes.ToList()))
    .WithTags(new[] { "Enums" })
    .WithName(nameof(ThesisOutcome))
    .Produces<List<ThesisOutcomeDto>>();

// ThesisType
app.MapGet("api/enums/ThesisType/list", ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => db.ThesisTypes.ToList())
    .WithTags(new[] { "Enums" })
    .WithName(nameof(ThesisType))
    .Produces<List<ThesisType>>();

// StudyProgramme
app.MapGet("api/enums/StudyProgramme/list",
        ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => mapper.Map<List<StudyProgrammeDto>>(db.StudyProgrammes.ToList()))
    .WithTags(new[] { "Enums" })
    .WithName(nameof(StudyProgramme))
    .Produces<List<StudyProgrammeDto>>();

// all enums
app.MapGet("api/enum/All/list", ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) =>
    {
        var departments = mapper.Map<List<DepartmentDto>>(db.Departments.ToList());
        var faculties = mapper.Map<List<FacultyDto>>(db.Faculties.ToList());
        var schoolYears = mapper.Map<List<SchoolYearDto>>(db.SchoolYears.ToList());
        var thesisOutcomes = mapper.Map<List<ThesisOutcomeDto>>(db.ThesisOutcomes.ToList());
        var thesisTypes = mapper.Map<List<ThesisTypeDto>>(db.ThesisTypes.ToList());
        var studyProgrammes = mapper.Map<List<StudyProgrammeDto>>(db.StudyProgrammes.ToList());
        return new EnumsDto
        {
            Departments = departments,
            Faculties = faculties,
            SchoolYears = schoolYears,
            ThesisOutcomes = thesisOutcomes,
            ThesisTypes = thesisTypes,
            StudyProgrammes = studyProgrammes
        };
    })
    .WithTags(new[] { "Enums" })
    .WithName("AllEnums")
    .Produces<EnumsDto>();

app.Run();
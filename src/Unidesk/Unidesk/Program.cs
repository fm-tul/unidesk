using MapsterMapper;
using Microsoft.AspNetCore.Authentication.Certificate;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Unidesk.Client;
using Unidesk.Configurations;
using Unidesk.Db;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Exceptions;
using Unidesk.Reports;
using Unidesk.Reports.Templates;
using Unidesk.Security;
using Unidesk.Server;
using Unidesk.Server.ServiceFilters;
using Unidesk.Services;
using Unidesk.Services.Email;
using Unidesk.Services.Email.Templates;
using Unidesk.Services.Enums;
using Unidesk.Services.Reports;
using Unidesk.Services.Stag;
using Unidesk.Services.ThesisTransitions;
using Unidesk.Utils;
using Unidesk.Utils.Extensions;
using OneOfExtensions = Unidesk.Utils.OneOfExtensions;


var builder = WebApplication.CreateBuilder(args);
var generateModel = Environment.GetEnvironmentVariable("GENERATE_MODEL") == "1";
var isDev = builder.Environment.IsDevelopment();

var services = builder.Services;

// optionally add appsettings.secret.{username}.json which is ignored
var configuration = builder.Configuration
   .AddJsonFile($"appsettings.secret.json", true)
   .AddJsonFile($"appsettings.secret.{Environment.UserName}.json", true)
   .Build();

if (isDev && false)
{
    Console.WriteLine("Configuration values:");
    foreach (var (key, value) in configuration.AsEnumerable()) Console.WriteLine($" - {key}={value.SafeSubstring(64)}");
    Console.WriteLine("----------------------------------------------------------------");

    Console.WriteLine("Configuration sources:");
    foreach (var source in configuration.Providers) Console.WriteLine($" - {source}");
    Console.WriteLine("----------------------------------------------------------------");

    Console.WriteLine("Working directory: " + Environment.CurrentDirectory);
    Console.WriteLine("----------------------------------------------------------------");
    Console.WriteLine("Files in working directory:");
    foreach (var file in Directory.GetFiles(Environment.CurrentDirectory)) Console.WriteLine($" - {file}");
}

services.AddEndpointsApiExplorer();
services.AddSwaggerGen(options =>
{
    options.UseAllOfForInheritance();
    options.EnableAnnotations(enableAnnotationsForInheritance: true, enableAnnotationsForPolymorphism: true);
});

services.AddAuthentication(CertificateAuthenticationDefaults.AuthenticationScheme)
   .AddCertificate(options => { });

// scoped
services.AddScoped<CryptographyUtils>();
services.AddScoped<StagService>();
services.AddScoped<ImportService>();
services.AddScoped<RequireGrantFilter>();
services.AddScoped<IUserProvider, UserProvider>();
services.AddScoped<UserService>();
services.AddScoped<TeamService>();
services.AddScoped<SimpleEnumService>();
services.AddScoped<IDateTimeService, DefaultDateTimeService>();
services.AddScoped<KeywordsService>();
services.AddScoped<AdminService>();
services.AddScoped<ReportService>();
services.AddScoped<SettingsService>();
services.AddScoped<ThesisEvaluationService>();
services.AddScoped<EmailService>();
services.AddScoped<DocumentService>();
services.AddScoped<IThesisEvaluation, ThesisEvaluation_Opponent_FM_Eng>();

services.AddSingleton<WordGeneratorService>();
services.AddSingleton<TemplateService>();


// mapper
if (isDev)
{
    // TypeAdapterConfig.GlobalSettings.Compiler = exp => exp.CompileWithDebugInfo();
}

services.AddSingleton(MapsterConfiguration.CreateMapsterConfig());
services.AddScoped<IMapper, ServiceMapper>();

// configs
var appOptions = configuration.GetSection(nameof(AppOptions)).Get<AppOptions>()!;
var emailOptions = configuration.GetSection(nameof(EmailOptions)).Get<EmailOptions>()!;
var connectionString = configuration.GetValue<string>("UNIDESK_CONNECTION_STRING")
                    ?? configuration.GetConnectionString(nameof(UnideskDbContext));

// singleton
services.AddSingleton(appOptions);
services.AddSingleton(emailOptions!);

// extra
services.AddOutputCache();
services.AddControllersWithFilters();
services.AddDevCors();
services.AddHttpContextAccessor();
services.AddCookieAuthentication();
services.AddDbContext<UnideskDbContext>(options =>
{
    // options.UseNpgsql(connectionString, optionsBuilder => { optionsBuilder.UseQuerySplittingBehavior(QuerySplittingBehavior.SingleQuery); });
    options.UseSqlServer(connectionString, optionsBuilder => { optionsBuilder.UseQuerySplittingBehavior(QuerySplittingBehavior.SingleQuery); });
    // https://stackoverflow.com/questions/70555317/multiple-level-properties-with-ef-core-6
    options.ConfigureWarnings(warnings => warnings.Ignore(CoreEventId.NavigationBaseIncludeIgnored));
});
services.AddScoped<CachedDbContext>();
services.AddDatabaseDeveloperPageExceptionFilter();
if (isDev && generateModel)
{
    services.AddSingleton(new ModelGeneration());
}

// state patters
services.AddScoped<IThesisStateTransitionService, ThesisDraftState>();

// resolver service
services.AddScoped<ThesisTransitionService>();


var app = builder.Build();

// using (var scope = app.Services.CreateScope())
// {
//     var reportService = scope.ServiceProvider.GetRequiredService<ReportService>()!;
//     reportService.GenerateReport();
// }

if (isDev)
{
    app.UseSwagger();
    app.UseSwaggerUI();
    if (generateModel)
    {
        app.GenerateModels<Program>(
            Path.GetFullPath(
                Path.Combine(Directory.GetCurrentDirectory(), "..", "Unidesk.Client", "src", "api-client", "constants")));
    }
}


app.UseExceptionHandler();
await app.MigrateDbAsync();


// app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.UseOutputCache();
app.MapControllers();
app.UseExceptionHandler(exceptionHandlerApp
    => exceptionHandlerApp.Run(UnideskExceptionHandler.HandleException));

// hello world / endpoint
app.MapGet("/test", () => "Hello World!");

var api = app.MapGroup("/api")
   .RequireAuthorization()
   .AddEndpointFilter<RequireGrantEndpointFilter>();

var apiEnums = api
   .MapGroup("/enums/")
   .CacheOutput(policyBuilder =>
    {
        policyBuilder.Expire(TimeSpan.FromMinutes(15));
        policyBuilder.Tag(EnumsCachedEndpoint.EnumsCacheTag);
        policyBuilder.AddPolicy(typeof(OutputCachingPolicy));
    });

// add all minimal api routes for listing the basic enum-like types
apiEnums.AddMinimalApiGetters();
// add all minimal api routes for creating or updating the basic enum-like types
apiEnums.AddMinimalApiSetters();
// add all minimal api routes for deleting the basic enum-like types
apiEnums.AddMinimalApiDeleters();

// all enums
apiEnums.MapGet("All/list", ([FromServices] UnideskDbContext db, [FromServices] IMapper mapper) => new EnumsDto
    {
        Departments = mapper.Map<List<DepartmentDto>>(db.Departments.ToList()),
        Faculties = mapper.Map<List<FacultyDto>>(db.Faculties.ToList()),
        SchoolYears = mapper.Map<List<SchoolYearDto>>(db.SchoolYears.ToList()),
        ThesisOutcomes = mapper.Map<List<ThesisOutcomeDto>>(db.ThesisOutcomes.ToList()),
        ThesisTypes = mapper.Map<List<ThesisTypeDto>>(db.ThesisTypes.ToList()),
        StudyProgrammes = mapper.Map<List<StudyProgrammeDto>>(db.StudyProgrammes.ToList()),
        Roles = mapper.Map<List<UserRoleDto>>(db.UserRoles.ToList()),
    })
   .AllowAnonymous()
   .UseEnumsCachedEndpoint<EnumsDto>("AllEnums");


api.MapGet("enum/Cache/reset", async ([FromServices] IOutputCacheStore cache, CancellationToken ct) =>
{
    await cache.EvictByTagAsync(EnumsCachedEndpoint.EnumsCacheTag, ct);
    return new SimpleJsonResponse { Success = true, Message = "Ok" };
}).Produces<SimpleJsonResponse>();


var evaluationApi = api.MapGroup("evaluation")
   .WithTags("Evaluations")
   .RequireAuthorization();

evaluationApi.MapGet("/list/{id:guid}", async ([FromServices] ThesisEvaluationService service, Guid id, CancellationToken ct)
        => await service.GetAllAsync(id, ct))
   .WithName("GetAll")
   .Produces<List<ThesisEvaluationDto>>();

evaluationApi.MapGet("/get/{id:guid}", async ([FromServices] ThesisEvaluationService service, Guid id, string? pass, CancellationToken ct)
        => await service.GetOneAsync(id, pass, ct))
   .WithName("GetOne")
   .AllowAnonymous()
   .Produces<ThesisEvaluationDetailDto>();

evaluationApi.MapGet("/peek/{id:guid}", async ([FromServices] ThesisEvaluationService service, Guid id, CancellationToken ct)
        => await service.PeekAsync(id, ct))
   .WithName("Peek")
   .AllowAnonymous()
   .Produces<ThesisEvaluationPeekDto>();

evaluationApi.MapGet("/reject/{id:guid}", async ([FromServices] ThesisEvaluationService service, Guid id, string pass, string? reason, CancellationToken ct)
        => await service.RejectAsync(id, pass, reason, ct))
   .WithName("Reject")
   .AllowAnonymous();

evaluationApi.MapPost("/upsert", async ([FromServices] ThesisEvaluationService service, ThesisEvaluationDto dto, CancellationToken ct)
        => await OneOfExtensions.MatchAsync(service
           .Upsert(dto, ct), i => i, e => throw e)
    )
   .WithName("Upsert")
   .Produces<ThesisEvaluationPeekDto>()
   .RequireGrant(Grants.Action_ThesisEvaluation_Manage);

evaluationApi.MapPost("/update-one", async ([FromServices] ThesisEvaluationService service, ThesisEvaluationDetailDto dto, string pass, CancellationToken ct)
        => await OneOfExtensions.MatchAsync(service
           .UpdateOne(dto, pass, ct), i => i, e => throw e)
    )
   .WithName("UpdateOne")
   .AllowAnonymous()
   .Produces<ThesisEvaluationDetailDto>();

evaluationApi.MapPut("/change-status", async ([FromServices] ThesisEvaluationService service, Guid id, EvaluationStatus status, CancellationToken ct)
        => await service.ChangeStatus(id, status, null, ct))
   .WithName("ChangeStatus")
   .Produces<ThesisEvaluationDto>()
   .RequireGrant(Grants.Action_ThesisEvaluation_Manage);

evaluationApi.MapPut("/change-status-pass", async ([FromServices] ThesisEvaluationService service, Guid id, EvaluationStatus status, string? pass, CancellationToken ct)
        => await service.ChangeStatus(id, status, pass, ct))
   .WithName("ChangeStatusWithPass")
   .AllowAnonymous()
   .Produces<ThesisEvaluationDto>();

evaluationApi.MapGet("/pdf-preview", async ([FromServices] ThesisEvaluationService service, Guid id, string? pass, CancellationToken ct)
        =>
    {
        var bytes = await service.PdfPreviewAsync(id, pass, ct);
        return Results.Bytes(bytes, "application/pdf");
    })
   .WithName("GetPdfPreview")
   .AllowAnonymous()
   .Produces<IResult>();

evaluationApi.MapDelete("/delete/{id:guid}", async ([FromServices] ThesisEvaluationService service, Guid id, CancellationToken ct)
        => await service.DeleteOne(id, ct))
   .WithName("DeleteOne")
   .RequireGrant(Grants.Action_ThesisEvaluation_Manage);

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapFallbackToFile("index.html");
// if (!isDev || true)
// {
//     app.UseClientAppStaticFiles();
// }


if (isDev && generateModel)
{
    ModelGeneration.ShutDownAfterModelGenerated(app);
}


app.Run();

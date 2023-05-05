using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Serilog;
using Serilog.Events;
using Unidesk.Client;
using Unidesk.Configurations;
using Unidesk.Controllers;
using Unidesk.Db;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Exceptions;
using Unidesk.Logging;
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
using Unidesk.Tasks;
using Unidesk.Utils;
using OneOfExtensions = Unidesk.Utils.OneOfExtensions;


var builder = WebApplication.CreateBuilder(args);
var generateModel = Environment.GetEnvironmentVariable("GENERATE_MODEL") == "1";
var environmentType = Environment.GetEnvironmentVariable("UNIDESK_ENVIRONMENT") ?? "Local";
var isVerbose = Environment.GetEnvironmentVariable("UNIDESK_VERBOSE") == "1";
var isDev = builder.Environment.IsDevelopment();

var services = builder.Services;

// optionally add appsettings.secret.{username}.json which is ignored
var configuration = builder.Configuration
   .AddJsonFile("appsettings.secret.json", true)
   .AddJsonFile($"appsettings.{environmentType}.json", true)
   .AddJsonFile($"appsettings.secret.{environmentType}.json", true)
   .AddJsonFile($"appsettings.secret.{Environment.UserName}.json", true)
   .Build();

// configs
var appOptions = configuration.GetSection(nameof(AppOptions)).Get<AppOptions>()!;
appOptions.Environment = Enum.Parse<EnvironmentType>(environmentType);
var emailOptions = configuration.GetSection(nameof(EmailOptions)).Get<EmailOptions>()!;
var connectionString = configuration.GetValue<string>("UNIDESK_CONNECTION_STRING")
                    ?? configuration.GetConnectionString(nameof(UnideskDbContext));

var logger = builder.AddSerilogLogging(appOptions);
logger.Information("Starting application");

if (isVerbose)
{
    configuration.PrintConfiguration();
}

services.AddEndpointsApiExplorer();
services.AddSwaggerGen(options =>
{
    options.UseAllOfForInheritance();
    options.EnableAnnotations(enableAnnotationsForInheritance: true, enableAnnotationsForPolymorphism: true);
});

// services.AddAuthentication(CertificateAuthenticationDefaults.AuthenticationScheme)
//    .AddCertificate(options => { });

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
services.AddScoped<EvaluationService>();
services.AddScoped<EmailService>();
services.AddScoped<DocumentService>();
services.AddScoped<InternshipService>();
services.AddScoped<ChangeTrackerService>();
services.AddScoped<ServerService>();
services.AddScoped<IEvaluationTemplate, ThesisiEvaluationTemplateOpponentFmEng>();
services.AddScoped<IEvaluationTemplate, InternshipEvaluationTemplateSupervisorCz>();
services.AddScoped<IClock, SystemClock>();

services.AddSingleton<WordGeneratorService>();
services.AddSingleton<TemplateFactory>();

// hosted services
services.AddHostedService<InternshipTask>();
services.AddHostedService<EmailScheduler>();


// mapper
if (isDev)
{
    // TypeAdapterConfig.GlobalSettings.Compiler = exp => exp.CompileWithDebugInfo();
}

services.AddSingleton(MapsterConfiguration.CreateMapsterConfig());
services.AddScoped<IMapper, ServiceMapper>();

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

// state patters
services.AddScoped<IThesisStateTransitionService, ThesisDraftState>();

// resolver service
services.AddScoped<ThesisTransitionService>();


var app = builder.Build();
app.UseSerilogRequestLogging(options =>
{
    options.Logger = logger;
    options.MessageTemplate = "{RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    options.IncludeQueryInRequestPath = true;
    options.GetLevel = (context, duration, ex) =>
    {
        if (ex != null)
        {
            return LogEventLevel.Error;
        }
        if (duration > TimeSpan.FromSeconds(1).TotalMilliseconds)
        {
            return LogEventLevel.Warning;
        }
        if (context.Request.Path.ToString().StartsWith("/assets/"))
        {
            return LogEventLevel.Verbose;
        }
        
        return LogEventLevel.Information;
    };
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        diagnosticContext.Set("UserName", httpContext.User.Identity?.Name ?? "[anon]");
    };
});

if (generateModel || true)
{
    var constantsDir = Path.Combine(Directory.GetCurrentDirectory(), "..", "Unidesk.Client", "src", "api-client", "constants");
    app.GenerateModels<Program>(Path.GetFullPath(constantsDir));
    logger.Information("Generated models");
}

if (!generateModel)
{
    await app.MigrateDbAsync();
}

if (isDev)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();

if (appOptions.Environment == EnvironmentType.Prod)
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();
app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseMiddleware<LogUserNameMiddleware>();
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
    })
   .Produces<SimpleJsonResponse>();


api.MapGroup("evaluation")
   .WithTags("Evaluations")
   .RequireAuthorization()
   .MapEvaluationApi();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
using Microsoft.EntityFrameworkCore;
using Unidesk.Configurations;
using Unidesk.Db;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Dtos;
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


// scoped
services.AddScoped<CryptographyUtils>();
services.AddScoped<StagService>();
services.AddScoped<ImportService>();
services.AddScoped<RequireGrantFilter>();
services.AddScoped<IUserProvider, UserProvider>();
services.AddScoped<UserService>();
services.AddAutoMapper(options =>
{
    options.CreateMap<IdEntity, IdEntityDto>();
    options.CreateMap<TrackedEntity, TrackedEntityDto>();
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

app.UseExceptionHandler();
await app.MigrateDbAsync();


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();



app.MapControllers();

app.Run();
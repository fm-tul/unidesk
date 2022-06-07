using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Unidesk.Configurations;
using Unidesk.Db;
using Unidesk.Server;
using Unidesk.ServiceFilters;
using Unidesk.Services;
using Unidesk.Utils;


var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

// optionally add appsettings.secret.{username}.json which is ignored
var configuration = builder.Configuration
    .AddJsonFile($"appsettings.secret.{Environment.UserName}.json", true)
    .Build();

services.AddScoped<CryptographyUtils>();
var appOptions = configuration.GetSection(nameof(AppOptions)).Get<AppOptions>();
services.AddSingleton(appOptions);

services.AddControllers(options =>
{
    options.Filters.AddService<RequireGrantFilter>();
});
services.AddScoped<RequireGrantFilter>();
services.AddDevCors();
services.AddHttpContextAccessor();
services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Events.OnValidatePrincipal = CookieAuthentication.OnValidatePrincipal;
    });

services.AddScoped<IUserProvider, UserProvider>();
services.AddScoped<UserService>();
services.AddDbContext<UnideskDbContext>(options => options.UseSqlServer(configuration.GetConnectionString(nameof(UnideskDbContext))));

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
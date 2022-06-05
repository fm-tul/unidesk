using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Server;
using Unidesk.ServiceFilters;
using Unidesk.Services;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

// optionally add appsettings.secret.{username}.json which is ignored
var configuration = builder.Configuration
    .AddJsonFile($"appsettings.secret.{Environment.UserName}.json", true)
    .Build();

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
        options.Events.OnValidatePrincipal = async (context) =>
        {
            var userProvider = context.HttpContext.RequestServices.GetService<IUserProvider>()!;
            var loginService = context.HttpContext.RequestServices.GetService<LoginService>()!;
            var user = userProvider.GetUserFromCookie(context, loginService);
            userProvider.CurrentUser = user ?? User.Guest;
            
            // to disable guest user
            // if (userProvider.CurrentUser == User.Guest)
            // {
            //     context.RejectPrincipal();
            // }
        };
    });

services.AddScoped<IUserProvider, UserProvider>();
services.AddScoped<LoginService>();
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
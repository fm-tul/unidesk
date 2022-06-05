using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Server;
using Unidesk.Services;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

// optionally add appsettings.secret.{username}.json which is ignored
var configuration = builder.Configuration
    .AddJsonFile($"appsettings.secret.{Environment.UserName}.json", true)
    .Build();

services.AddControllers();
services.AddDevCors();

services.AddScoped<IUserProvider, UserProvider>();
services.AddDbContext<UnideskDbContext>(options => options.UseSqlServer(configuration.GetConnectionString(nameof(UnideskDbContext))));

services.AddDatabaseDeveloperPageExceptionFilter();


var app = builder.Build();

app.UseExceptionHandler();
await app.MigrateDbAsync();


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors();

app.MapControllers();

app.Run();
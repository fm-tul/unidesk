using Microsoft.EntityFrameworkCore;
using Unidesk.Db;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

// optionally add appsettings.secret.{username}.json which is ignored
var configuration = builder.Configuration
    .AddJsonFile($"appsettings.{Environment.UserName}.json", true)
    .Build();


services.AddDbContext<UnideskDbContext>(options =>
    {
        var config = configuration.GetConnectionString(nameof(UnideskDbContext));
        options.UseSqlServer(config);
    }
);

services.AddDatabaseDeveloperPageExceptionFilter();


var app = builder.Build();
var env = app.Environment;

if (!env.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}
else
{
    app.UseDeveloperExceptionPage();
    app.UseMigrationsEndPoint();
}

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<UnideskDbContext>();
    await context.Database.MigrateAsync();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.MapGet("/", () => "Hello World!");

app.Run();
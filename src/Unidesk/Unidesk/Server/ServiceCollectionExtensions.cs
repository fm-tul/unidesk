using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.FileProviders;
using Unidesk.Db;
using Unidesk.Dtos;
using Unidesk.Server.Converters;
using Unidesk.Server.ServiceFilters;
using Unidesk.Utils;
using Unidesk.Utils.Extensions;

namespace Unidesk.Server;

[ExcludeFromCodeCoverage]
public static class ServiceCollectionExtensions
{
    
    public static void PrintConfiguration(this IConfigurationRoot configuration)
    {
        Console.WriteLine("Configuration values:");
        foreach (var (key, value) in configuration.AsEnumerable()) Console.WriteLine($" - {key}={value.SafeSubstring(128)}");
        Console.WriteLine("----------------------------------------------------------------");

        Console.WriteLine("Configuration sources:");
        foreach (var source in configuration.Providers) Console.WriteLine($" - {source}");
        Console.WriteLine("----------------------------------------------------------------");

        Console.WriteLine("Working directory: " + Environment.CurrentDirectory);
        Console.WriteLine("----------------------------------------------------------------");
        Console.WriteLine("Files in working directory:");
        foreach (var file in Directory.GetFiles(Environment.CurrentDirectory)) Console.WriteLine($" - {file}");
    }
    
    public static IServiceCollection AddDevCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(
                policy =>
                {
                    policy.WithOrigins("https://localhost:3000", "https://127.0.0.1:3000")
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       .AllowCredentials()
                       .Build();
                });
        });

        return services;
    }

    public static WebApplication UseClientAppStaticFiles(this WebApplication app)
    {
        const string clientApp = "client-app";
        var candidates = new[]
        {
            Path.Combine(app.Environment.ContentRootPath, clientApp),
            Path.Combine(Directory.GetCurrentDirectory(), clientApp),
            Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "Unidesk.Client", "dist")),
        };

        var clientAppPath = candidates.FirstOrDefault(Directory.Exists)
                         ?? throw new DirectoryNotFoundException($"Could not find any of the following directories: {string.Join(", ", candidates)}");


        app.UseStaticFiles(new StaticFileOptions
        {
            RequestPath = "/assets",
            FileProvider = new PhysicalFileProvider(Path.Combine(clientAppPath, "assets")),
        });
        Console.WriteLine($"Serving static files from {clientAppPath}");

        // assets are served from the client-app directory
        // the rest is spa fallback
        app.Use(async (context, next) =>
        {
            if (context.Request.Path.StartsWithSegments("/assets"))
            {
                await next();
            }
            else if (context.Request.Path.StartsWithSegments("/api"))
            {
                await next();
            }
            else
            {
                context.Response.ContentType = "text/html";
                await context.Response.SendFileAsync(Path.Combine(clientAppPath, "index.html"));
            }
        });

        return app;
    }

    public static IServiceCollection AddCookieAuthentication(this IServiceCollection services)
    {
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
           .AddCookie(options => { options.Events.OnValidatePrincipal = CookieAuthentication.OnValidatePrincipal; });

        return services;
    }

    public static IServiceCollection AddControllersWithFilters(this IServiceCollection services)
    {
        services.AddControllersWithViews(options => { options.Filters.AddService<RequireGrantFilter>(); })
           .AddJsonOptions(o => { o.JsonSerializerOptions.Converters.Add(new DateOnlyJsonConverter()); });

        return services;
    }

    public static async Task<WebApplication> MigrateDbAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<UnideskDbContext>();
        var firstTime = !await (db.Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator)!.ExistsAsync();
        await db.Database.MigrateAsync();
        await db.SeedDbAsync(firstTime);

        return app;
    }

    public static WebApplication UseExceptionHandler(this WebApplication app)
    {
        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }
        else
        {
            app.UseDeveloperExceptionPage();
            app.UseMigrationsEndPoint();
        }

        return app;
    }

    public static void GenerateAdminShibbo(this IHost app)
    {
        using var scope = app.Services.CreateScope();
        var cryptography = scope.ServiceProvider.GetRequiredService<CryptographyUtils>();
        var payload = new LoginShibboRequest
        {
            Affiliation = "admin",
            Eppn = "admin@unidesk.tul.cz",
            Rnd = new Random().Next(),
            Time = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
        };
        var payloadJson = JsonSerializer.Serialize(payload);
        var base64 = cryptography.EncryptText(payloadJson);
        Console.WriteLine(base64);
    }
}
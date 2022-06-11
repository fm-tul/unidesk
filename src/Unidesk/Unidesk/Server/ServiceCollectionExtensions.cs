using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.ServiceFilters;

namespace Unidesk.Server;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDevCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(
                policy =>
                {
                    policy.WithOrigins("https://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .Build();
                });
        });

        return services;
    }
    
    public static IServiceCollection AddCookieAuthentication(this IServiceCollection services)
    {
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.Events.OnValidatePrincipal = CookieAuthentication.OnValidatePrincipal;
            });

        return services;
    }
    
    public static IServiceCollection AddControllersWithFilters(this IServiceCollection services)
    {
        services.AddControllers(options =>
        {
            options.Filters.AddService<RequireGrantFilter>();
        });

        return services;
    }

    public static async Task<WebApplication> MigrateDbAsync(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<UnideskDbContext>();
            await context.Database.MigrateAsync();
            await context.SeedDbAsync();
        }

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
}
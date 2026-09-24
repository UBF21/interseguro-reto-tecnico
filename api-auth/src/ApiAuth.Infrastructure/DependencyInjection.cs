using ApiAuth.Application.Features.Auth.Interfaces;
using ApiAuth.Application.Features.Auth.Repositories;
using ApiAuth.Infrastructure.Persistence;
using ApiAuth.Infrastructure.Persistence.Repositories;
using ApiAuth.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace ApiAuth.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Flag exclusivo para integration tests (WebApplicationFactory) -- evita registrar
        // Npgsql + InMemory a la vez en el mismo IServiceCollection (EF Core lo rechaza).
        var useInMemory = configuration.GetValue<bool>("Testing:UseInMemoryDatabase");
        services.AddDbContext<AuthDbContext>(opts =>
        {
            if (useInMemory)
                opts.UseInMemoryDatabase("api-auth-tests");
            else
                opts.UseNpgsql(configuration.GetConnectionString("Postgres"));
        });

        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();

        return services;
    }
}

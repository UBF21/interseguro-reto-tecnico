using ApiAuth.Application.Features.Auth.Interfaces;
using ApiAuth.Application.Features.Auth.Repositories;
using ApiAuth.Infrastructure;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ApiAuth.Tests.Infrastructure;

public class InfrastructureDependencyInjectionTests
{
    [Fact]
    public void AddInfrastructure_RegistersAllPorts()
    {
        var services = new ServiceCollection();
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:Postgres"] = "Host=localhost;Database=test",
                ["Jwt:Secret"] = "super-secret-key-at-least-32-bytes-long!!",
                ["Jwt:Issuer"] = "api-auth",
                ["Jwt:Audience"] = "interseguro-reto",
            }).Build();

        services.AddInfrastructure(configuration);
        var provider = services.BuildServiceProvider();

        provider.GetService<IUserRepository>().Should().NotBeNull();
        provider.GetService<IPasswordHasher>().Should().NotBeNull();
        provider.GetService<IJwtTokenGenerator>().Should().NotBeNull();
    }
}

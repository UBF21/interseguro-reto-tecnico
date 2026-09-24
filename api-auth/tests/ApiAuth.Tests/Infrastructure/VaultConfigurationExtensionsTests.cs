using ApiAuth.Infrastructure.Secrets;
using FluentAssertions;

namespace ApiAuth.Tests.Infrastructure;

public class VaultConfigurationExtensionsTests
{
    [Fact]
    public void BuildConfigOverrides_MapsVaultKeys_ToConfigurationKeys()
    {
        var vaultData = new Dictionary<string, object>
        {
            ["jwt_secret"] = "vault-secret",
            ["jwt_issuer"] = "api-auth",
            ["jwt_audience"] = "interseguro-reto",
            ["postgres_connection_string"] = "Host=postgres;Database=interseguro_auth",
        };

        var overrides = VaultConfigurationExtensions.BuildConfigOverrides(vaultData);

        overrides["Jwt:Secret"].Should().Be("vault-secret");
        overrides["ConnectionStrings:Postgres"].Should().Be("Host=postgres;Database=interseguro_auth");
    }

    [Fact]
    public void BuildConfigOverrides_MissingKey_MapsToNull_DoesNotThrow()
    {
        var overrides = VaultConfigurationExtensions.BuildConfigOverrides(new Dictionary<string, object>());

        overrides["Jwt:Secret"].Should().BeNull();
    }

    [Fact]
    public async Task AddVaultSecretsAsync_WithoutVaultEnvVars_IsNoOp()
    {
        Environment.SetEnvironmentVariable("VAULT_ADDR", null);
        Environment.SetEnvironmentVariable("VAULT_TOKEN", null);
        var configuration = new Microsoft.Extensions.Configuration.ConfigurationBuilder();

        await configuration.AddVaultSecretsAsync();

        configuration.Sources.Should().BeEmpty();
    }
}

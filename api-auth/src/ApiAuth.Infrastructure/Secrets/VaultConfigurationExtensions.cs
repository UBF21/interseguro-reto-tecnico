using Microsoft.Extensions.Configuration;
using VaultSharp;
using VaultSharp.V1.AuthMethods.Token;

namespace ApiAuth.Infrastructure.Secrets;

// Vault en modo dev (docker-compose) reemplaza los secretos de appsettings.json en runtime --
// appsettings.json nunca lleva valores reales (ver placeholders "REEMPLAZAR-EN-ENV-..."), esto
// es lo único que los sobreescribe con los reales. Si VAULT_ADDR no está seteado (dev local sin
// Docker), se usan los placeholders tal cual -- por eso nunca son secretos de verdad ahí.
public static class VaultConfigurationExtensions
{
    public const string SecretMountPoint = "secret";
    public const string SecretPath = "api-auth";

    public static async Task AddVaultSecretsAsync(this IConfigurationBuilder configuration)
    {
        var vaultAddress = Environment.GetEnvironmentVariable("VAULT_ADDR");
        var vaultToken = Environment.GetEnvironmentVariable("VAULT_TOKEN");
        if (string.IsNullOrWhiteSpace(vaultAddress) || string.IsNullOrWhiteSpace(vaultToken))
            return;

        var client = new VaultClient(new VaultClientSettings(vaultAddress, new TokenAuthMethodInfo(vaultToken)));
        var secret = await client.V1.Secrets.KeyValue.V2.ReadSecretAsync(SecretPath, mountPoint: SecretMountPoint);

        configuration.AddInMemoryCollection(BuildConfigOverrides((IReadOnlyDictionary<string, object>)secret.Data.Data));
    }

    // Lógica pura, separada de la llamada de red a Vault -- testeable sin un servidor real.
    public static Dictionary<string, string?> BuildConfigOverrides(IReadOnlyDictionary<string, object> vaultData) => new()
    {
        ["Jwt:Secret"] = vaultData.GetValueOrDefault("jwt_secret")?.ToString(),
        ["Jwt:Issuer"] = vaultData.GetValueOrDefault("jwt_issuer")?.ToString(),
        ["Jwt:Audience"] = vaultData.GetValueOrDefault("jwt_audience")?.ToString(),
        ["ConnectionStrings:Postgres"] = vaultData.GetValueOrDefault("postgres_connection_string")?.ToString(),
    };
}

export interface AppSecrets {
  jwtSecret: string;
  jwtIssuer: string;
  jwtAudience: string;
  postgresUrl: string;
}

interface VaultKvV2Response {
  data: { data: Record<string, string> };
}

// Vault en modo dev (docker-compose) es la fuente de verdad de secretos -- appsettings/.env solo
// llevan placeholders. No-op (usa fallbacks de env vars locales) si VAULT_ADDR no está seteado.
export async function loadSecrets(fallback: AppSecrets, fetchImpl: typeof fetch = fetch): Promise<AppSecrets> {
  const vaultAddr = process.env.VAULT_ADDR;
  const vaultToken = process.env.VAULT_TOKEN;
  if (!vaultAddr || !vaultToken) return fallback;

  const response = await fetchImpl(`${vaultAddr}/v1/secret/data/api-endosos`, {
    headers: { 'X-Vault-Token': vaultToken },
  });
  // Vault configurado (VAULT_ADDR/VAULT_TOKEN) pero la llamada falló -- nunca caer en silencio al
  // secreto placeholder del código: si se hace, y otro servicio sí leyó el secreto real de Vault,
  // los JWT dejan de validar entre servicios sin ningún log que lo explique.
  if (!response.ok) {
    throw new Error(`Vault respondió ${response.status} al leer secret/data/api-endosos -- abortando arranque.`);
  }

  const body = (await response.json()) as VaultKvV2Response;
  return mapVaultData(body.data.data, fallback);
}

// Lógica pura, separada del fetch -- testeable sin un servidor real.
export function mapVaultData(data: Record<string, string>, fallback: AppSecrets): AppSecrets {
  return {
    jwtSecret: data.jwt_secret ?? fallback.jwtSecret,
    jwtIssuer: data.jwt_issuer ?? fallback.jwtIssuer,
    jwtAudience: data.jwt_audience ?? fallback.jwtAudience,
    postgresUrl: data.postgres_connection_string ?? fallback.postgresUrl,
  };
}

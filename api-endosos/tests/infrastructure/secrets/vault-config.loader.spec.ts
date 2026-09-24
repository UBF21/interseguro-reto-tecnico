import { AppSecrets, loadSecrets, mapVaultData } from '../../../src/infrastructure/secrets/vault-config.loader';

const fallback: AppSecrets = { jwtSecret: 'fallback-secret', jwtIssuer: 'api-auth', jwtAudience: 'interseguro-reto', postgresUrl: 'postgres://fallback' };

describe('vault-config.loader', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = { ...originalEnv };
  });
  afterAll(() => {
    process.env = originalEnv;
  });

  it('mapVaultData maps vault keys onto AppSecrets, falling back when a key is missing', () => {
    const secrets = mapVaultData({ jwt_secret: 'vault-secret' }, fallback);

    expect(secrets.jwtSecret).toBe('vault-secret');
    expect(secrets.postgresUrl).toBe('postgres://fallback');
  });

  it('loadSecrets returns the fallback without calling fetch when VAULT_ADDR is unset', async () => {
    delete process.env.VAULT_ADDR;
    delete process.env.VAULT_TOKEN;
    const fetchImpl = jest.fn();

    const secrets = await loadSecrets(fallback, fetchImpl as unknown as typeof fetch);

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(secrets).toBe(fallback);
  });

  it('loadSecrets fetches from Vault KV v2 when VAULT_ADDR/VAULT_TOKEN are set', async () => {
    process.env.VAULT_ADDR = 'http://vault:8200';
    process.env.VAULT_TOKEN = 'root';
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { data: { jwt_secret: 'from-vault' } } }),
    });

    const secrets = await loadSecrets(fallback, fetchImpl as unknown as typeof fetch);

    expect(fetchImpl).toHaveBeenCalledWith('http://vault:8200/v1/secret/data/api-endosos', {
      headers: { 'X-Vault-Token': 'root' },
    });
    expect(secrets.jwtSecret).toBe('from-vault');
  });

  it('loadSecrets throws (never falls back silently) when Vault responds with a non-OK status', async () => {
    process.env.VAULT_ADDR = 'http://vault:8200';
    process.env.VAULT_TOKEN = 'root';
    const fetchImpl = jest.fn().mockResolvedValue({ ok: false, status: 403 });

    await expect(loadSecrets(fallback, fetchImpl as unknown as typeof fetch)).rejects.toThrow(/Vault respondió 403/);
  });

  it('loadSecrets throws (never falls back silently) when the Vault request itself fails', async () => {
    process.env.VAULT_ADDR = 'http://vault:8200';
    process.env.VAULT_TOKEN = 'root';
    const fetchImpl = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'));

    await expect(loadSecrets(fallback, fetchImpl as unknown as typeof fetch)).rejects.toThrow('ECONNREFUSED');
  });
});

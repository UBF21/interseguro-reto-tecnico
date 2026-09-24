import HapiJwt from '@hapi/jwt';
import { DataSource } from 'typeorm';
import { createApp } from '../src/app';
import { REQUIRED_ROLE, ROLE_CLAIM } from '../src/infrastructure/auth/jwt-auth.plugin';
import { AppSecrets } from '../src/infrastructure/secrets/vault-config.loader';

const secrets: AppSecrets = {
  jwtSecret: 'a-very-long-test-secret-at-least-32-bytes',
  jwtIssuer: 'api-auth',
  jwtAudience: 'interseguro-reto',
  postgresUrl: 'postgres://unused-in-this-test',
};

function fakeDataSource(findOneResult: unknown): DataSource {
  return { getRepository: jest.fn().mockReturnValue({ findOne: jest.fn().mockResolvedValue(findOneResult) }) } as unknown as DataSource;
}

function validToken(): string {
  return HapiJwt.token.generate(
    { aud: secrets.jwtAudience, iss: secrets.jwtIssuer, sub: 'user-1', [ROLE_CLAIM]: REQUIRED_ROLE },
    secrets.jwtSecret,
  );
}

describe('createApp', () => {
  it('answers the browser CORS preflight for the web origin', async () => {
    const server = await createApp(fakeDataSource(null), secrets);

    const response = await server.inject({
      method: 'OPTIONS',
      url: '/v1/endorse/translate',
      headers: {
        origin: 'http://localhost:5273',
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'content-type,authorization',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5273');
  });

  it('GET /health is public and returns ok', async () => {
    const server = await createApp(fakeDataSource(null), secrets);

    const response = await server.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
  });

  it('redirects "/" to the Swagger docs only when enableSwagger is true', async () => {
    const withSwagger = await createApp(fakeDataSource(null), secrets, { enableSwagger: true });
    const withoutSwagger = await createApp(fakeDataSource(null), secrets);

    const withResponse = await withSwagger.inject({ method: 'GET', url: '/' });
    const withoutResponse = await withoutSwagger.inject({ method: 'GET', url: '/' });

    expect(withResponse.statusCode).toBe(302);
    expect(withResponse.headers.location).toBe('/documentation');
    expect(withoutResponse.statusCode).toBe(404);
  });

  it('POST /v1/endorse/translate without a token returns 401', async () => {
    const server = await createApp(fakeDataSource(null), secrets);

    const response = await server.inject({
      method: 'POST',
      url: '/v1/endorse/translate',
      payload: { policyNumber: '1', idEnvio: 1, producto: 'Rumbo', tipoEndoso: 'X' },
    });

    expect(response.statusCode).toBe(401);
  });

  it('POST /v1/endorse/translate with a valid token but the wrong role returns 401', async () => {
    const server = await createApp(fakeDataSource(null), secrets);
    const wrongRoleToken = HapiJwt.token.generate(
      { aud: secrets.jwtAudience, iss: secrets.jwtIssuer, sub: 'user-1', [ROLE_CLAIM]: 'otro-rol' },
      secrets.jwtSecret,
    );

    const response = await server.inject({
      method: 'POST',
      url: '/v1/endorse/translate',
      headers: { authorization: `Bearer ${wrongRoleToken}` },
      payload: { policyNumber: '1', idEnvio: 1, producto: 'Rumbo', tipoEndoso: 'X' },
    });

    expect(response.statusCode).toBe(401);
  });

  it('POST /v1/endorse/translate with a valid token but no matching template returns 404 in the envelope', async () => {
    const server = await createApp(fakeDataSource(null), secrets);

    const response = await server.inject({
      method: 'POST',
      url: '/v1/endorse/translate',
      headers: { authorization: `Bearer ${validToken()}` },
      payload: { policyNumber: '1', idEnvio: 1, producto: 'Rumbo', tipoEndoso: 'NoExiste' },
    });

    expect(response.statusCode).toBe(404);
    expect(response.result).toMatchObject({ success: false, code: 'TEMPLATE_NOT_FOUND' });
  });

  it('POST /v1/endorse/translate with an invalid payload returns 400 wrapped in the envelope', async () => {
    const server = await createApp(fakeDataSource(null), secrets);

    const response = await server.inject({
      method: 'POST',
      url: '/v1/endorse/translate',
      headers: { authorization: `Bearer ${validToken()}` },
      payload: { idEnvio: 1, producto: 'Rumbo', tipoEndoso: 'X' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.result).toMatchObject({ success: false });
    expect((response.result as { message: string }).message).toBeTruthy();
  });

  it('an unexpected thrown Error (not a DomainException) returns 500 wrapped in the envelope, without leaking the internal message', async () => {
    const dataSource = {
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn().mockRejectedValue(new Error('db connection lost')),
      }),
    } as unknown as DataSource;
    const server = await createApp(dataSource, secrets);

    const response = await server.inject({
      method: 'POST',
      url: '/v1/endorse/translate',
      headers: { authorization: `Bearer ${validToken()}` },
      payload: { policyNumber: '1', idEnvio: 1, producto: 'Rumbo', tipoEndoso: 'X' },
    });

    expect(response.statusCode).toBe(500);
    const body = response.result as { success: boolean; message: string };
    expect(body.success).toBe(false);
    expect(body.message).not.toContain('db connection lost');
  });
});

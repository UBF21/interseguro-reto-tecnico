import Hapi from '@hapi/hapi';
import HapiJwt from '@hapi/jwt';
import { REQUIRED_ROLE, ROLE_CLAIM, registerJwtAuth } from '../../../src/infrastructure/auth/jwt-auth.plugin';

const secret = 'a-very-long-test-secret-32-bytes';
const issuer = 'api-auth';
const audience = 'interseguro-reto';

async function buildProtectedServer(): Promise<Hapi.Server> {
  const server = Hapi.server();
  await registerJwtAuth(server, { secret, issuer, audience });
  server.route({ method: 'GET', path: '/protegido', handler: () => 'ok' });
  return server;
}

function tokenWithRole(role: string | undefined): string {
  const payload: Record<string, unknown> = { aud: audience, iss: issuer, sub: 'user-1' };
  if (role !== undefined) payload[ROLE_CLAIM] = role;
  return HapiJwt.token.generate(payload, secret);
}

describe('registerJwtAuth', () => {
  it('registers a "jwt" auth strategy and sets it as default', async () => {
    const server = await buildProtectedServer();

    const response = await server.inject({ method: 'GET', url: '/protegido' });

    expect(response.statusCode).toBe(401);
  });

  it('allows the request when the token carries the required role claim', async () => {
    const server = await buildProtectedServer();

    const response = await server.inject({
      method: 'GET',
      url: '/protegido',
      headers: { authorization: `Bearer ${tokenWithRole(REQUIRED_ROLE)}` },
    });

    expect(response.statusCode).toBe(200);
  });

  it('rejects a valid token that carries the wrong role', async () => {
    const server = await buildProtectedServer();

    const response = await server.inject({
      method: 'GET',
      url: '/protegido',
      headers: { authorization: `Bearer ${tokenWithRole('otro-rol')}` },
    });

    expect(response.statusCode).toBe(401);
  });

  it('rejects a valid token with no role claim at all', async () => {
    const server = await buildProtectedServer();

    const response = await server.inject({
      method: 'GET',
      url: '/protegido',
      headers: { authorization: `Bearer ${tokenWithRole(undefined)}` },
    });

    expect(response.statusCode).toBe(401);
  });
});

import Hapi from '@hapi/hapi';
import { registerRateLimit } from '../../../src/infrastructure/http/rate-limit.plugin';

function buildServer(max: number, windowMs: number, now: () => number): Hapi.Server {
  const server = Hapi.server();
  registerRateLimit(server, { max, windowMs, now });
  server.route({ method: 'GET', path: '/x', handler: () => 'ok' });
  return server;
}

describe('registerRateLimit', () => {
  it('allows requests under the limit', async () => {
    const server = buildServer(2, 60_000, () => 1000);

    const first = await server.inject({ method: 'GET', url: '/x' });
    const second = await server.inject({ method: 'GET', url: '/x' });

    expect(first.statusCode).toBe(200);
    expect(second.statusCode).toBe(200);
  });

  it('rejects the request over the limit with 429 and RATE_LIMITED code', async () => {
    const server = buildServer(2, 60_000, () => 1000);

    await server.inject({ method: 'GET', url: '/x' });
    await server.inject({ method: 'GET', url: '/x' });
    const third = await server.inject({ method: 'GET', url: '/x' });

    expect(third.statusCode).toBe(429);
    expect(third.result).toMatchObject({ success: false, code: 'RATE_LIMITED' });
  });

  it('resets the counter after the window expires', async () => {
    let currentTime = 1000;
    const server = buildServer(1, 60_000, () => currentTime);

    await server.inject({ method: 'GET', url: '/x' });
    const withinWindow = await server.inject({ method: 'GET', url: '/x' });
    currentTime += 60_001;
    const afterWindow = await server.inject({ method: 'GET', url: '/x' });

    expect(withinWindow.statusCode).toBe(429);
    expect(afterWindow.statusCode).toBe(200);
  });
});

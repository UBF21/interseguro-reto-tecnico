import Hapi from '@hapi/hapi';
import { ApiResponse } from '../../common/responses/api-response';

interface RateLimitOptions {
  max: number;
  windowMs: number;
  now?: () => number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

// Fixed-window in-memory por IP -- alcance de demo, un solo proceso, sin Redis. Si se escala a
// múltiples réplicas, cada una cuenta por separado (no hay estado compartido).
export function registerRateLimit(server: Hapi.Server, { max, windowMs, now = Date.now }: RateLimitOptions): void {
  const buckets = new Map<string, Bucket>();

  server.ext('onPreAuth', (request, h) => {
    const key = request.info.remoteAddress;
    const current = now();
    const bucket = buckets.get(key);

    if (!bucket || current >= bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: current + windowMs });
      return h.continue;
    }

    bucket.count += 1;
    if (bucket.count > max) {
      return h
        .response(ApiResponse.fail('Demasiadas solicitudes. Intenta de nuevo en un momento.', null, 'RATE_LIMITED'))
        .code(429)
        .takeover();
    }

    return h.continue;
  });
}

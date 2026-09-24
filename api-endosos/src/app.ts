import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { DataSource } from 'typeorm';
import { ApiResponse } from './common/responses/api-response';
import { DomainException } from './common/errors/domain-exception';
import { mapErrorToResponse } from './common/errors/error-response.mapper';
import { EndorseTranslateController } from './features/endorse-translate/controllers/endorse-translate.controller';
import { buildEndorseTranslateRoutes } from './features/endorse-translate/routes/endorse-translate.routes';
import { TemplateToJsonMapper } from './features/endorse-translate/mappers/template-to-json.mapper';
import { EndorseTranslateService } from './features/endorse-translate/services/endorse-translate.service';
import { registerJwtAuth } from './infrastructure/auth/jwt-auth.plugin';
import { registerRateLimit } from './infrastructure/http/rate-limit.plugin';
import { registerSwagger } from './infrastructure/http/swagger.plugin';
import { TypeOrmTemplateRepository } from './infrastructure/persistence/repositories/typeorm-template.repository';
import { AppSecrets } from './infrastructure/secrets/vault-config.loader';

export interface CreateAppOptions {
  enableSwagger?: boolean;
}

export async function createApp(dataSource: DataSource, secrets: AppSecrets, options: CreateAppOptions = {}): Promise<Hapi.Server> {
  const server = Hapi.server({
    port: process.env.PORT ?? 3001,
    host: '0.0.0.0',
    // Sin esto, el preflight OPTIONS del navegador no tiene headers Access-Control-*, el fetch()
    // del frontend falla con "Failed to fetch" aunque curl/Postman funcionen (no hacen preflight).
    routes: { cors: { origin: [process.env.WEB_ORIGIN ?? 'http://localhost:5273'] } },
  });

  await registerJwtAuth(server, { secret: secrets.jwtSecret, issuer: secrets.jwtIssuer, audience: secrets.jwtAudience });
  registerRateLimit(server, { max: 60, windowMs: 60_000 });

  if (options.enableSwagger) {
    await registerSwagger(server);
  }

  const templateRepository = new TypeOrmTemplateRepository(dataSource);
  const controller = new EndorseTranslateController(new EndorseTranslateService(templateRepository, new TemplateToJsonMapper()));
  server.route(buildEndorseTranslateRoutes(controller));

  server.route({ method: 'GET', path: '/health', options: { auth: false }, handler: () => ({ status: 'ok' }) });

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response instanceof DomainException) {
      const { statusCode, body } = mapErrorToResponse(response);
      return h.response(body).code(statusCode);
    }
    if (Boom.isBoom(response)) {
      // output.payload.message (no response.message) -- Boom ya sanitiza el mensaje real a uno
      // genérico para 5xx; response.message es el mensaje original del Error y SÍ puede filtrar
      // detalle interno (ej. "db connection lost") si se usa directo.
      return h.response(ApiResponse.fail(response.output.payload.message)).code(response.output.statusCode);
    }
    return h.continue;
  });

  return server;
}

import 'reflect-metadata';
import { createApp } from './app';
import { createDataSource } from './infrastructure/persistence/data-source';
import { seedDemoTemplate } from './infrastructure/persistence/seed';
import { loadSecrets } from './infrastructure/secrets/vault-config.loader';

export async function main(): Promise<void> {
  const secrets = await loadSecrets({
    jwtSecret: process.env.JWT_SECRET ?? 'REEMPLAZAR-EN-ENV-super-secret-key-min-32-bytes',
    jwtIssuer: process.env.JWT_ISSUER ?? 'api-auth',
    jwtAudience: process.env.JWT_AUDIENCE ?? 'interseguro-reto',
    postgresUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/interseguro_endosos',
  });

  const dataSource = createDataSource(secrets.postgresUrl);
  await dataSource.initialize();
  await seedDemoTemplate(dataSource);

  // Swagger UI solo en desarrollo -- nunca expuesto en un despliegue real.
  const server = await createApp(dataSource, secrets, { enableSwagger: process.env.NODE_ENV !== 'production' });
  await server.start();
  process.stdout.write(`api-endosos escuchando en ${server.info.uri}\n`);
}

/* istanbul ignore next -- entrypoint real, no se ejecuta al importar el módulo desde un test */
if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`Fallo al iniciar api-endosos: ${error instanceof Error ? error.stack : String(error)}\n`);
    process.exit(1);
  });
}

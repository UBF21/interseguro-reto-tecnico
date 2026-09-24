import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

// Solo se registra en desarrollo (ver server.ts) -- documentación interactiva no debe exponerse
// en un despliegue real. Sirve la UI en la raíz ("/") para que al levantar el servicio ya se vea.
export async function registerSwagger(server: Hapi.Server): Promise<void> {
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: { title: 'api-endosos', version: '1.0.0', description: 'Traductor de endosos (Reto 1)' },
        grouping: 'tags',
        securityDefinitions: {
          Bearer: { type: 'apiKey', name: 'Authorization', in: 'header' },
        },
        security: [{ Bearer: [] }],
      },
    },
  ]);

  // "/" ya es la documentación interactiva al levantar el servicio en dev -- sin esto, /
  // devuelve 404 y hay que conocer de antemano /documentation.
  server.route({
    method: 'GET',
    path: '/',
    options: { auth: false },
    handler: (_request, h) => h.redirect('/documentation'),
  });
}

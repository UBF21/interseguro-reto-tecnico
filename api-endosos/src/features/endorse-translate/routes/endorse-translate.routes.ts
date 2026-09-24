import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { EndorseTranslateController } from '../controllers/endorse-translate.controller';

// Solo valida el shape mínimo del JSON plano -- el resto de campos dinámicos se validan contra
// la plantilla configurada en BD (capa Service/Mapper), no acá.
const endorseTranslateRequestSchema = Joi.object({
  policyNumber: Joi.string().required(),
  idEnvio: Joi.number().required(),
  producto: Joi.string().required(),
  tipoEndoso: Joi.string().required(),
}).unknown(true);

export function buildEndorseTranslateRoutes(controller: EndorseTranslateController): ServerRoute[] {
  return [
    {
      method: 'POST',
      path: '/v1/endorse/translate',
      options: {
        auth: 'jwt',
        tags: ['api', 'endorse'],
        description: 'Traduce un endoso en JSON plano a la estructura que espera el core.',
        validate: { payload: endorseTranslateRequestSchema },
      },
      handler: (request, h) => controller.translate(request.payload as never, h),
    },
  ];
}

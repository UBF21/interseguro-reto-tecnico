import { buildEndorseTranslateRoutes } from '../../../../src/features/endorse-translate/routes/endorse-translate.routes';
import { EndorseTranslateController } from '../../../../src/features/endorse-translate/controllers/endorse-translate.controller';

describe('buildEndorseTranslateRoutes', () => {
  it('registers a versioned, JWT-protected POST /v1/endorse/translate route', () => {
    const controller = {} as EndorseTranslateController;

    const [route] = buildEndorseTranslateRoutes(controller);

    expect(route.method).toBe('POST');
    expect(route.path).toBe('/v1/endorse/translate');
    expect(route.options).toMatchObject({ auth: 'jwt' });
  });

  it('the payload schema accepts unknown dynamic fields beyond the required ones', () => {
    const controller = {} as EndorseTranslateController;
    const [route] = buildEndorseTranslateRoutes(controller);
    const schema = (route.options as any).validate.payload;

    const { error } = schema.validate({
      policyNumber: '1',
      idEnvio: 1,
      producto: 'Rumbo',
      tipoEndoso: 'CambioFrecuencia',
      frecuencia: 'Semestral',
    });

    expect(error).toBeUndefined();
  });

  it('the payload schema rejects a request missing a required field', () => {
    const controller = {} as EndorseTranslateController;
    const [route] = buildEndorseTranslateRoutes(controller);
    const schema = (route.options as any).validate.payload;

    const { error } = schema.validate({ idEnvio: 1, producto: 'Rumbo', tipoEndoso: 'CambioFrecuencia' });

    expect(error).toBeDefined();
  });
});

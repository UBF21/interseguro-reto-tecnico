import { mapErrorToResponse } from '../../../src/common/errors/error-response.mapper';
import { MissingRequiredFieldsException, TemplateNotFoundException } from '../../../src/common/errors/domain-exception';

describe('mapErrorToResponse', () => {
  it('maps MissingRequiredFieldsException to 422 with the list of missing fields', () => {
    const { statusCode, body } = mapErrorToResponse(new MissingRequiredFieldsException(['NombreUsuario']));

    expect(statusCode).toBe(422);
    expect(body.code).toBe('MISSING_REQUIRED_FIELDS');
    expect(body.data).toEqual({ missingFields: ['NombreUsuario'] });
  });

  it('maps TemplateNotFoundException to 404', () => {
    const { statusCode, body } = mapErrorToResponse(new TemplateNotFoundException('Rumbo', 'X'));

    expect(statusCode).toBe(404);
    expect(body.code).toBe('TEMPLATE_NOT_FOUND');
  });

  it('maps an unknown error to 500 with a generic message, never leaking internal detail', () => {
    const { statusCode, body } = mapErrorToResponse(new Error('detalle interno sensible'));

    expect(statusCode).toBe(500);
    expect(body.message).toBe('Ocurrió un error interno.');
    expect(body.message).not.toContain('detalle interno sensible');
  });
});

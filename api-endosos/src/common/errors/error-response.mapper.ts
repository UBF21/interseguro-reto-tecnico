import { ApiResponse } from '../responses/api-response';
import { DomainException, MissingRequiredFieldsException, TemplateNotFoundException } from './domain-exception';

export interface MappedError {
  statusCode: number;
  body: ApiResponse<unknown>;
}

// Lógica pura de mapeo excepción -> (status, envelope) -- separada del extension point de Hapi
// para poder testearla sin levantar un server real.
export function mapErrorToResponse(error: unknown): MappedError {
  if (error instanceof MissingRequiredFieldsException) {
    return { statusCode: 422, body: ApiResponse.fail('Solicitud inválida.', { missingFields: error.missingFields }, error.code) };
  }

  if (error instanceof TemplateNotFoundException) {
    return { statusCode: 404, body: ApiResponse.fail(error.message, null, error.code) };
  }

  if (error instanceof DomainException) {
    return { statusCode: 422, body: ApiResponse.fail(error.message, null, error.code) };
  }

  return { statusCode: 500, body: ApiResponse.fail('Ocurrió un error interno.') };
}

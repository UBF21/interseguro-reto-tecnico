import { ApiResponse } from '../../../src/common/responses/api-response';

describe('ApiResponse', () => {
  it('ok() sets success true and null code', () => {
    const response = ApiResponse.ok('payload', 'listo');

    expect(response.success).toBe(true);
    expect(response.data).toBe('payload');
    expect(response.code).toBeNull();
  });

  it('fail() sets success false and propagates code', () => {
    const response = ApiResponse.fail<null>('plantilla no encontrada', null, 'TEMPLATE_NOT_FOUND');

    expect(response.success).toBe(false);
    expect(response.code).toBe('TEMPLATE_NOT_FOUND');
  });
});

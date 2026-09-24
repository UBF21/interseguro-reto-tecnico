import { EndorseTranslateController } from '../../../../src/features/endorse-translate/controllers/endorse-translate.controller';
import { EndorseTranslateService } from '../../../../src/features/endorse-translate/services/endorse-translate.service';

describe('EndorseTranslateController', () => {
  it('wraps the service result in ApiResponse.ok with a 200', async () => {
    const service = { translate: jest.fn().mockResolvedValue({ policyNumber: '1' }) } as unknown as EndorseTranslateService;
    const controller = new EndorseTranslateController(service);
    const code = jest.fn().mockReturnValue('final-response');
    const h = { response: jest.fn().mockReturnValue({ code }) } as any;

    const result = await controller.translate({ policyNumber: '1', idEnvio: 1, producto: 'Rumbo', tipoEndoso: 'X' }, h);

    expect(h.response).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: { policyNumber: '1' } }));
    expect(code).toHaveBeenCalledWith(200);
    expect(result).toBe('final-response');
  });
});

import { EndorseTranslateRequestDto } from '../../../../src/features/endorse-translate/dtos/endorse-translate.dto';

describe('EndorseTranslateRequestDto', () => {
  it('accepts known fields plus arbitrary dynamic keys', () => {
    const dto: EndorseTranslateRequestDto = {
      policyNumber: '123',
      idEnvio: 1,
      producto: 'Rumbo',
      tipoEndoso: 'CambioFrecuencia',
      frecuencia: 'Semestral',
    };

    expect(dto.frecuencia).toBe('Semestral');
  });
});

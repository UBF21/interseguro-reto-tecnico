import { TemplateNotFoundException } from '../../../../src/common/errors/domain-exception';
import { EndorseTranslateRequestDto } from '../../../../src/features/endorse-translate/dtos/endorse-translate.dto';
import { EndorseTranslateService } from '../../../../src/features/endorse-translate/services/endorse-translate.service';
import { TemplateToJsonMapper } from '../../../../src/features/endorse-translate/mappers/template-to-json.mapper';
import { TemplateRepository } from '../../../../src/features/endorse-translate/repositories/template.repository';
import { TemplateConfig } from '../../../../src/features/endorse-translate/repositories/template-config.dto';

const input: EndorseTranslateRequestDto = { policyNumber: '1', idEnvio: 1, producto: 'Rumbo', tipoEndoso: 'CambioFrecuencia' };
const emptyConfig: TemplateConfig = {
  dynamicFields: [],
  eventsApplied: [{ description: 'SolicitarEndoso', orderEvent: 1 }],
  staticMappings: [],
};

describe('EndorseTranslateService', () => {
  it('delegates to the mapper when a template is found', async () => {
    const repository: TemplateRepository = { findActiveTemplate: jest.fn().mockResolvedValue(emptyConfig) };
    const service = new EndorseTranslateService(repository, new TemplateToJsonMapper());

    const result = await service.translate(input);

    expect(repository.findActiveTemplate).toHaveBeenCalledWith('Rumbo', 'CambioFrecuencia');
    expect(result.policyNumber).toBe('1');
  });

  it('throws TemplateNotFoundException when no active template exists', async () => {
    const repository: TemplateRepository = { findActiveTemplate: jest.fn().mockResolvedValue(null) };
    const service = new EndorseTranslateService(repository, new TemplateToJsonMapper());

    await expect(service.translate(input)).rejects.toThrow(TemplateNotFoundException);
  });
});

import { TemplateRepository } from '../../../../src/features/endorse-translate/repositories/template.repository';
import { TemplateConfig } from '../../../../src/features/endorse-translate/repositories/template-config.dto';

describe('TemplateRepository contract', () => {
  it('a fake implementation satisfies the interface shape', async () => {
    const config: TemplateConfig = { dynamicFields: [], eventsApplied: [], staticMappings: [] };
    const fake: TemplateRepository = {
      findActiveTemplate: async () => config,
    };

    await expect(fake.findActiveTemplate('Rumbo', 'CambioFrecuencia')).resolves.toBe(config);
  });
});

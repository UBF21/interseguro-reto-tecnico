import { DataSource } from 'typeorm';
import { seedDemoTemplate } from '../../../src/infrastructure/persistence/seed';

function fakeRepo(overrides: Partial<Record<string, jest.Mock>> = {}) {
  return {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn((x) => x),
    save: jest.fn(async (x) => x),
    ...overrides,
  };
}

describe('seedDemoTemplate', () => {
  it('is a no-op when the demo template already exists', async () => {
    const templateRepo = fakeRepo({ findOne: jest.fn().mockResolvedValue({ id: 'existing' }) });
    const dataSource = { getRepository: jest.fn().mockReturnValue(templateRepo) } as unknown as DataSource;

    await seedDemoTemplate(dataSource);

    expect(templateRepo.save).not.toHaveBeenCalled();
  });

  it('creates product, endorsement type and template with dynamicFields/eventsApplied/staticMappings when missing', async () => {
    const repos: Record<string, ReturnType<typeof fakeRepo>> = {
      ProductEntity: fakeRepo(),
      EndorsementTypeEntity: fakeRepo(),
      TemplateEntity: fakeRepo(),
    };
    const dataSource = {
      getRepository: jest.fn((entity: { name: string }) => repos[entity.name]),
    } as unknown as DataSource;

    await seedDemoTemplate(dataSource);

    expect(repos.TemplateEntity.save).toHaveBeenCalledTimes(1);
    const savedTemplate = repos.TemplateEntity.save.mock.calls[0][0];
    expect(savedTemplate.dynamicFields).toHaveLength(12);
    expect(savedTemplate.eventsApplied).toHaveLength(2);
    expect(savedTemplate.staticMappings).toHaveLength(3);
  });
});

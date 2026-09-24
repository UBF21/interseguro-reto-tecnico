import { DataSource } from 'typeorm';
import { TypeOrmTemplateRepository } from '../../../../src/infrastructure/persistence/repositories/typeorm-template.repository';

describe('TypeOrmTemplateRepository', () => {
  it('returns null when no active template matches', async () => {
    const findOne = jest.fn().mockResolvedValue(null);
    const dataSource = { getRepository: jest.fn().mockReturnValue({ findOne }) } as unknown as DataSource;
    const repository = new TypeOrmTemplateRepository(dataSource);

    const result = await repository.findActiveTemplate('Rumbo', 'CambioFrecuencia');

    expect(result).toBeNull();
    expect(findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          isActive: true,
          product: { code: 'Rumbo' },
          endorsementType: { code: 'CambioFrecuencia' },
        }),
      }),
    );
  });

  it('orders by version DESC as defense in depth alongside the DB unique constraint', async () => {
    const findOne = jest.fn().mockResolvedValue(null);
    const dataSource = { getRepository: jest.fn().mockReturnValue({ findOne }) } as unknown as DataSource;
    const repository = new TypeOrmTemplateRepository(dataSource);

    await repository.findActiveTemplate('Rumbo', 'CambioFrecuencia');

    expect(findOne).toHaveBeenCalledWith(expect.objectContaining({ order: { version: 'DESC' } }));
  });

  it('maps the ORM entity graph into a plain TemplateConfig', async () => {
    const findOne = jest.fn().mockResolvedValue({
      dynamicFields: [{ order: 1, etiqueta: 'X', sourceField: 'producto', defaultValue: null, required: true }],
      eventsApplied: [{ description: 'SolicitarEndoso', orderEvent: 1 }],
      staticMappings: [{ targetField: 'currency', sourceField: 'moneda' }],
    });
    const dataSource = { getRepository: jest.fn().mockReturnValue({ findOne }) } as unknown as DataSource;
    const repository = new TypeOrmTemplateRepository(dataSource);

    const result = await repository.findActiveTemplate('Rumbo', 'CambioFrecuencia');

    expect(result).toEqual({
      dynamicFields: [{ order: 1, etiqueta: 'X', sourceField: 'producto', defaultValue: null, required: true }],
      eventsApplied: [{ description: 'SolicitarEndoso', orderEvent: 1 }],
      staticMappings: [{ targetField: 'currency', sourceField: 'moneda' }],
    });
  });
});

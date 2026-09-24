import { EndorsementTypeEntity, ProductEntity } from '../../../../src/infrastructure/persistence/entities/catalog.entity';

describe('Catalog entities', () => {
  it('ProductEntity holds code and name', () => {
    const product = Object.assign(new ProductEntity(), { code: 'RUMBO', name: 'Rumbo' });
    expect(product.code).toBe('RUMBO');
  });

  it('EndorsementTypeEntity holds code and name', () => {
    const type = Object.assign(new EndorsementTypeEntity(), { code: 'CAMBIO_FRECUENCIA', name: 'Cambio de Frecuencia' });
    expect(type.name).toBe('Cambio de Frecuencia');
  });
});

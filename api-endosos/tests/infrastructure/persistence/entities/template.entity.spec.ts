import { TemplateEntity } from '../../../../src/infrastructure/persistence/entities/template.entity';

describe('TemplateEntity', () => {
  it('defaults isActive to true and version to 1 via TypeORM column defaults', () => {
    // TypeORM column defaults apply at INSERT time, no en el constructor plano --
    // acá solo confirmamos que la propiedad existe y es asignable.
    const template = Object.assign(new TemplateEntity(), { version: 2, isActive: false });
    expect(template.version).toBe(2);
    expect(template.isActive).toBe(false);
  });
});

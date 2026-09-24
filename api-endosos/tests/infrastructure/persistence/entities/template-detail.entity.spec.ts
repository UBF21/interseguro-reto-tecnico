import {
  TemplateDynamicFieldEntity,
  TemplateEventAppliedEntity,
  TemplateStaticMappingEntity,
} from '../../../../src/infrastructure/persistence/entities/template-detail.entity';

describe('Template detail entities', () => {
  it('TemplateDynamicFieldEntity holds order, etiqueta, source/default and required', () => {
    const field = Object.assign(new TemplateDynamicFieldEntity(), {
      order: 1,
      etiqueta: 'ProductosVida',
      sourceField: 'producto',
      defaultValue: null,
      required: true,
    });
    expect(field.order).toBe(1);
    expect(field.required).toBe(true);
  });

  it('TemplateEventAppliedEntity holds description and orderEvent', () => {
    const event = Object.assign(new TemplateEventAppliedEntity(), { description: 'SolicitarEndoso', orderEvent: 1 });
    expect(event.orderEvent).toBe(1);
  });

  it('TemplateStaticMappingEntity holds targetField and sourceField', () => {
    const mapping = Object.assign(new TemplateStaticMappingEntity(), { targetField: 'currency', sourceField: 'moneda' });
    expect(mapping.targetField).toBe('currency');
  });
});

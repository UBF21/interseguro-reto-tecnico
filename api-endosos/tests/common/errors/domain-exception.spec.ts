import {
  InvalidFieldTypeException,
  MisconfiguredTemplateException,
  MissingRequiredFieldsException,
  TemplateNotFoundException,
} from '../../../src/common/errors/domain-exception';

describe('DomainException', () => {
  it('TemplateNotFoundException carries a stable code and readable message', () => {
    const ex = new TemplateNotFoundException('Rumbo', 'CambioFrecuencia');

    expect(ex.code).toBe('TEMPLATE_NOT_FOUND');
    expect(ex.message).toContain('Rumbo');
    expect(ex.message).toContain('CambioFrecuencia');
  });

  it('MissingRequiredFieldsException exposes the list of missing fields', () => {
    const ex = new MissingRequiredFieldsException(['NumeroPolizaEndoso', 'FechaEfectiva']);

    expect(ex.code).toBe('MISSING_REQUIRED_FIELDS');
    expect(ex.missingFields).toEqual(['NumeroPolizaEndoso', 'FechaEfectiva']);
  });

  it('InvalidFieldTypeException carries a stable code and mentions the field and received type', () => {
    const ex = new InvalidFieldTypeException('ProductosVida', 'object');

    expect(ex.code).toBe('INVALID_FIELD_TYPE');
    expect(ex.message).toContain('ProductosVida');
    expect(ex.message).toContain('object');
  });

  it('MisconfiguredTemplateException carries a stable code', () => {
    const ex = new MisconfiguredTemplateException();

    expect(ex.code).toBe('MISCONFIGURED_TEMPLATE');
  });
});

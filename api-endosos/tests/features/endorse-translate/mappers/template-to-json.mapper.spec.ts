import {
  InvalidFieldTypeException,
  MisconfiguredTemplateException,
  MissingRequiredFieldsException,
} from '../../../../src/common/errors/domain-exception';
import { TemplateToJsonMapper } from '../../../../src/features/endorse-translate/mappers/template-to-json.mapper';
import { TemplateConfig } from '../../../../src/features/endorse-translate/repositories/template-config.dto';

const rumboCambioFrecuenciaConfig: TemplateConfig = {
  dynamicFields: [
    { order: 1, etiqueta: 'ProductosVida', sourceField: 'producto', defaultValue: null, required: true },
    { order: 2, etiqueta: 'NombreUsuario', sourceField: 'usuario', defaultValue: null, required: true },
    { order: 3, etiqueta: 'NumeroPolizaEndoso', sourceField: 'policyNumber', defaultValue: null, required: true },
    { order: 4, etiqueta: 'TipoEndosoPol', sourceField: null, defaultValue: 'Endoso Simple', required: false },
    { order: 5, etiqueta: 'ResponsableAtencion', sourceField: null, defaultValue: 'SAC', required: false },
    { order: 6, etiqueta: 'InicioVigenciaEndoso', sourceField: null, defaultValue: 'Default', required: false },
  ],
  eventsApplied: [
    { description: 'AprobarEndoso', orderEvent: 2 },
    { description: 'SolicitarEndoso', orderEvent: 1 },
  ],
  staticMappings: [
    { targetField: 'financialPlansEntity', sourceField: 'frecuencia' },
    { targetField: 'currency', sourceField: 'moneda' },
    { targetField: 'productEntity', sourceField: 'producto' },
  ],
};

const input = {
  policyNumber: '08200000049',
  idEnvio: 5984,
  frecuencia: 'Semestral',
  tipoEndoso: 'CambioFrecuencia',
  producto: 'Rumbo',
  plan: 'PlanRumbo',
  moneda: 'Nuevo Sol',
  usuario: 'interface.servicios',
};

describe('TemplateToJsonMapper', () => {
  const mapper = new TemplateToJsonMapper();

  it('builds the structured JSON matching order, defaults and static mappings from the PDF example', () => {
    const result = mapper.map(input, rumboCambioFrecuenciaConfig);

    expect(result).toMatchObject({
      policyNumber: '08200000049',
      idEnvio: 5984,
      financialPlansEntity: { description: 'Semestral' },
      currency: { description: 'Nuevo Sol' },
      productEntity: { description: 'Rumbo' },
      eventEntity: {
        description: 'SolicitarEndoso',
        dynamicData: [
          { etiqueta: 'ProductosVida', value: 'Rumbo' },
          { etiqueta: 'NombreUsuario', value: 'interface.servicios' },
          { etiqueta: 'NumeroPolizaEndoso', value: '08200000049' },
          { etiqueta: 'TipoEndosoPol', value: 'Endoso Simple' },
          { etiqueta: 'ResponsableAtencion', value: 'SAC' },
          { etiqueta: 'InicioVigenciaEndoso', value: 'Default' },
        ],
      },
      eventAppliedEntities: [
        { description: 'SolicitarEndoso', orderEvent: 1 },
        { description: 'AprobarEndoso', orderEvent: 2 },
      ],
    });
  });

  it('sorts eventAppliedEntities by orderEvent regardless of config array order', () => {
    const result = mapper.map(input, rumboCambioFrecuenciaConfig) as any;
    expect(result.eventAppliedEntities.map((e: any) => e.orderEvent)).toEqual([1, 2]);
  });

  it('throws MissingRequiredFieldsException when a required field has no value and no default', () => {
    const configMissingUser = {
      ...rumboCambioFrecuenciaConfig,
      dynamicFields: [{ order: 1, etiqueta: 'NombreUsuario', sourceField: 'usuario', defaultValue: null, required: true }],
    };

    expect(() => mapper.map({ ...input, usuario: undefined }, configMissingUser)).toThrow(MissingRequiredFieldsException);
  });

  it('does not throw when an optional field is missing and falls back to empty string', () => {
    const configOptional = {
      ...rumboCambioFrecuenciaConfig,
      dynamicFields: [{ order: 1, etiqueta: 'Opcional', sourceField: 'campoInexistente', defaultValue: null, required: false }],
    };

    const result = mapper.map(input, configOptional) as any;
    expect(result.eventEntity.dynamicData[0]).toEqual({ etiqueta: 'Opcional', value: '' });
  });

  it('throws InvalidFieldTypeException when a dynamic field source resolves to an object', () => {
    const configObjectSource = {
      ...rumboCambioFrecuenciaConfig,
      dynamicFields: [{ order: 1, etiqueta: 'Campo', sourceField: 'objetoAnidado', defaultValue: null, required: false }],
    };

    expect(() => mapper.map({ ...input, objetoAnidado: { nested: true } }, configObjectSource)).toThrow(
      InvalidFieldTypeException,
    );
  });

  it('throws InvalidFieldTypeException when a dynamic field source resolves to an array', () => {
    const configArraySource = {
      ...rumboCambioFrecuenciaConfig,
      dynamicFields: [{ order: 1, etiqueta: 'Campo', sourceField: 'listaValores', defaultValue: null, required: false }],
    };

    expect(() => mapper.map({ ...input, listaValores: [1, 2, 3] }, configArraySource)).toThrow(InvalidFieldTypeException);
  });

  it('throws MisconfiguredTemplateException when eventsApplied is empty', () => {
    const configNoEvents = { ...rumboCambioFrecuenciaConfig, eventsApplied: [] };

    expect(() => mapper.map(input, configNoEvents)).toThrow(MisconfiguredTemplateException);
  });
});

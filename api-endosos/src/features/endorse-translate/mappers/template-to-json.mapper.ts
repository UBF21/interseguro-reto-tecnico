import {
  InvalidFieldTypeException,
  MisconfiguredTemplateException,
  MissingRequiredFieldsException,
} from '../../../common/errors/domain-exception';
import {
  TemplateConfig,
  TemplateDynamicFieldConfig,
  TemplateEventAppliedConfig,
} from '../repositories/template-config.dto';

export type FlatEndorseInput = Record<string, unknown>;

// Convierte el JSON plano de entrada en el JSON estructurado del core, respetando el orden y los
// valores por defecto definidos en la plantilla (BD) -- la única lógica de negocio real del reto.
export class TemplateToJsonMapper {
  map(input: FlatEndorseInput, config: TemplateConfig): Record<string, unknown> {
    const dynamicData = this.buildDynamicData(input, config.dynamicFields);
    const eventsApplied = this.sortedEvents(config.eventsApplied);

    if (eventsApplied.length === 0) throw new MisconfiguredTemplateException();

    return {
      policyNumber: input.policyNumber,
      idEnvio: input.idEnvio,
      ...this.buildStaticEntities(input, config.staticMappings),
      eventEntity: { description: eventsApplied[0].description, dynamicData },
      eventAppliedEntities: eventsApplied.map((e) => ({ description: e.description, orderEvent: e.orderEvent })),
      riskUnitEntities: this.buildRiskUnitEntities(input),
      participationEntities: [],
    };
  }

  private buildDynamicData(input: FlatEndorseInput, fields: TemplateDynamicFieldConfig[]) {
    const missingFields: string[] = [];
    const sorted = [...fields].sort((a, b) => a.order - b.order);

    const dynamicData = sorted.map((field) => {
      const value = this.resolveValue(input, field.sourceField, field.defaultValue);
      if (field.required && this.isEmpty(value)) missingFields.push(field.etiqueta);
      this.assertPrimitive(field.etiqueta, value);
      return { etiqueta: field.etiqueta, value: value ?? '' };
    });

    if (missingFields.length > 0) throw new MissingRequiredFieldsException(missingFields);
    return dynamicData;
  }

  private sortedEvents(events: TemplateEventAppliedConfig[]) {
    return [...events].sort((a, b) => a.orderEvent - b.orderEvent);
  }

  private buildStaticEntities(input: FlatEndorseInput, mappings: TemplateConfig['staticMappings']) {
    const entities: Record<string, unknown> = {};
    for (const mapping of mappings) {
      entities[mapping.targetField] = { description: input[mapping.sourceField] ?? null };
    }
    return entities;
  }

  // ponytail: riskUnitEntities queda con esta forma fija (solo `plan` es configurable vía
  // input) -- el enunciado solo pide plantillas dinámicas para dynamicData/eventAppliedEntities,
  // no para este bloque. Subir a config de BD si un futuro producto necesita variarlo.
  private buildRiskUnitEntities(input: FlatEndorseInput) {
    return [
      {
        insuranceObjectEntities: [{ insuranceObjectNumber: '1', coverageEntities: [], participationEntities: [] }],
        plansEntity: { description: input.plan ?? null },
        riskUnitNumber: '1',
      },
    ];
  }

  private resolveValue(input: FlatEndorseInput, sourceField: string | null, defaultValue: string | null): unknown {
    const raw = sourceField ? input[sourceField] : undefined;
    return this.isEmpty(raw) ? defaultValue : raw;
  }

  private isEmpty(value: unknown): boolean {
    return value === undefined || value === null || value === '';
  }

  // El PDF espera siempre un value primitivo en dynamicData -- si el campo de origen del input
  // resuelve a un objeto/array, es un error del cliente, no algo para serializar tal cual.
  private assertPrimitive(etiqueta: string, value: unknown): void {
    if (value !== null && typeof value === 'object') {
      throw new InvalidFieldTypeException(etiqueta, Array.isArray(value) ? 'array' : 'object');
    }
  }
}

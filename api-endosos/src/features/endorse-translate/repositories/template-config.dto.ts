export interface TemplateDynamicFieldConfig {
  order: number;
  etiqueta: string;
  sourceField: string | null;
  defaultValue: string | null;
  required: boolean;
}

export interface TemplateEventAppliedConfig {
  description: string;
  orderEvent: number;
}

export interface TemplateStaticMappingConfig {
  targetField: string;
  sourceField: string;
}

export interface TemplateConfig {
  dynamicFields: TemplateDynamicFieldConfig[];
  eventsApplied: TemplateEventAppliedConfig[];
  staticMappings: TemplateStaticMappingConfig[];
}

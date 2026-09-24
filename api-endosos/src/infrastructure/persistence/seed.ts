import { DataSource } from 'typeorm';
import { EndorsementTypeEntity, ProductEntity } from './entities/catalog.entity';
import { TemplateDynamicFieldEntity, TemplateEventAppliedEntity, TemplateStaticMappingEntity } from './entities/template-detail.entity';
import { TemplateEntity } from './entities/template.entity';

interface FieldSeed {
  order: number;
  etiqueta: string;
  sourceField: string | null;
  defaultValue: string | null;
  required: boolean;
}

const DEMO_FIELDS: FieldSeed[] = [
  { order: 1, etiqueta: 'ProductosVida', sourceField: 'producto', defaultValue: null, required: true },
  { order: 2, etiqueta: 'NombreUsuario', sourceField: 'usuario', defaultValue: null, required: true },
  { order: 3, etiqueta: 'NumeroPolizaEndoso', sourceField: 'policyNumber', defaultValue: null, required: true },
  { order: 4, etiqueta: 'TipoEndosoPol', sourceField: null, defaultValue: 'Endoso Simple', required: false },
  { order: 5, etiqueta: 'ResponsableAtencion', sourceField: null, defaultValue: 'SAC', required: false },
  { order: 6, etiqueta: 'EndosoModifPrima', sourceField: null, defaultValue: 'Si', required: false },
  { order: 7, etiqueta: 'InicioVigenciaEndoso', sourceField: null, defaultValue: 'Default', required: false },
  { order: 8, etiqueta: 'TipoVigenciaEndoso', sourceField: null, defaultValue: '', required: false },
  { order: 9, etiqueta: 'EndososSimplesSACRumbo', sourceField: null, defaultValue: 'TES008', required: false },
  { order: 10, etiqueta: 'FechaSolicitud', sourceField: 'fechaSolicitud', defaultValue: null, required: true },
  { order: 11, etiqueta: 'FechaCliente', sourceField: 'fechaCliente', defaultValue: null, required: true },
  { order: 12, etiqueta: 'FechaEfectiva', sourceField: 'fechaEfectiva', defaultValue: null, required: true },
];

// Seed de la plantilla Rumbo/CambioFrecuencia del enunciado -- deja el endpoint demoable end to
// end sin tener que armar datos a mano. Idempotente: no hace nada si ya existe.
export async function seedDemoTemplate(dataSource: DataSource): Promise<void> {
  const templateRepo = dataSource.getRepository(TemplateEntity);
  const existing = await templateRepo.findOne({ where: { product: { code: 'Rumbo' } } });
  if (existing) return;

  const product = await saveProduct(dataSource);
  const endorsementType = await saveEndorsementType(dataSource);

  await templateRepo.save(
    templateRepo.create({
      product,
      endorsementType,
      version: 1,
      isActive: true,
      dynamicFields: DEMO_FIELDS.map((f) => Object.assign(new TemplateDynamicFieldEntity(), f)),
      eventsApplied: buildEventsApplied(),
      staticMappings: buildStaticMappings(),
    }),
  );
}

async function saveProduct(dataSource: DataSource): Promise<ProductEntity> {
  const repo = dataSource.getRepository(ProductEntity);
  return repo.save(repo.create({ code: 'Rumbo', name: 'Rumbo' }));
}

async function saveEndorsementType(dataSource: DataSource): Promise<EndorsementTypeEntity> {
  const repo = dataSource.getRepository(EndorsementTypeEntity);
  return repo.save(repo.create({ code: 'CambioFrecuencia', name: 'Cambio de Frecuencia' }));
}

function buildEventsApplied(): TemplateEventAppliedEntity[] {
  return [
    Object.assign(new TemplateEventAppliedEntity(), { description: 'SolicitarEndoso', orderEvent: 1 }),
    Object.assign(new TemplateEventAppliedEntity(), { description: 'AprobarEndoso', orderEvent: 2 }),
  ];
}

function buildStaticMappings(): TemplateStaticMappingEntity[] {
  return [
    Object.assign(new TemplateStaticMappingEntity(), { targetField: 'financialPlansEntity', sourceField: 'frecuencia' }),
    Object.assign(new TemplateStaticMappingEntity(), { targetField: 'currency', sourceField: 'moneda' }),
    Object.assign(new TemplateStaticMappingEntity(), { targetField: 'productEntity', sourceField: 'producto' }),
  ];
}

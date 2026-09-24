import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { EndorsementTypeEntity, ProductEntity } from './entities/catalog.entity';
import { TemplateDynamicFieldEntity, TemplateEventAppliedEntity, TemplateStaticMappingEntity } from './entities/template-detail.entity';
import { TemplateEntity } from './entities/template.entity';

export function createDataSource(connectionUrl: string): DataSource {
  return new DataSource({
    type: 'postgres',
    url: connectionUrl,
    // synchronize:true -- alcance de reto técnico, no hay otro consumidor evolucionando el
    // schema en paralelo. Para un proyecto real, reemplazar por migraciones versionadas.
    synchronize: true,
    entities: [
      ProductEntity,
      EndorsementTypeEntity,
      TemplateEntity,
      TemplateDynamicFieldEntity,
      TemplateEventAppliedEntity,
      TemplateStaticMappingEntity,
    ],
  });
}

import { DataSource } from 'typeorm';
import { TemplateRepository } from '../../../features/endorse-translate/repositories/template.repository';
import { TemplateConfig } from '../../../features/endorse-translate/repositories/template-config.dto';
import { TemplateEntity } from '../entities/template.entity';

export class TypeOrmTemplateRepository implements TemplateRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findActiveTemplate(productCode: string, endorsementTypeCode: string): Promise<TemplateConfig | null> {
    const template = await this.dataSource.getRepository(TemplateEntity).findOne({
      where: {
        isActive: true,
        product: { code: productCode },
        endorsementType: { code: endorsementTypeCode },
      },
      relations: ['dynamicFields', 'eventsApplied', 'staticMappings'],
      order: { version: 'DESC' },
    });

    if (!template) return null;

    return {
      dynamicFields: template.dynamicFields.map((f) => ({
        order: f.order,
        etiqueta: f.etiqueta,
        sourceField: f.sourceField,
        defaultValue: f.defaultValue,
        required: f.required,
      })),
      eventsApplied: template.eventsApplied.map((e) => ({ description: e.description, orderEvent: e.orderEvent })),
      staticMappings: template.staticMappings.map((m) => ({ targetField: m.targetField, sourceField: m.sourceField })),
    };
  }
}

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TemplateEntity } from './template.entity';

// Orden y etiquetas esperadas de dynamicData -- ver /endorse/translate mapper.
@Entity('template_dynamic_fields')
export class TemplateDynamicFieldEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TemplateEntity, (template) => template.dynamicFields, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template: TemplateEntity;

  @Column({ name: 'sort_order' })
  order: number;

  @Column({ length: 100 })
  etiqueta: string;

  // Nombre del campo en el JSON plano de entrada de donde sale el value. Null = siempre usa defaultValue.
  // type:'varchar' explícito -- reflect-metadata reporta "Object" para propiedades `string | null`,
  // TypeORM no puede inferir el tipo de columna sin esta pista.
  @Column({ type: 'varchar', name: 'source_field', length: 100, nullable: true })
  sourceField: string | null;

  @Column({ type: 'varchar', name: 'default_value', length: 200, nullable: true })
  defaultValue: string | null;

  @Column({ default: false })
  required: boolean;
}

// Lista y orden de eventAppliedEntities.
@Entity('template_event_applied')
export class TemplateEventAppliedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TemplateEntity, (template) => template.eventsApplied, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template: TemplateEntity;

  @Column({ length: 100 })
  description: string;

  @Column({ name: 'order_event' })
  orderEvent: number;
}

// Mapeos de campos fijos del output (financialPlansEntity, currency, productEntity) a un campo
// del input, envueltos como { description: <valor> } en el JSON final.
@Entity('template_static_mappings')
export class TemplateStaticMappingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TemplateEntity, (template) => template.staticMappings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template: TemplateEntity;

  @Column({ name: 'target_field', length: 100 })
  targetField: string;

  @Column({ name: 'source_field', length: 100 })
  sourceField: string;
}

import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EndorsementTypeEntity, ProductEntity } from './catalog.entity';
import { TemplateDynamicFieldEntity, TemplateEventAppliedEntity, TemplateStaticMappingEntity } from './template-detail.entity';

// Una fila por combinación producto+tipoEndoso (+versión) -- agregar un producto/tipo nuevo es
// insertar filas acá y en sus tablas hijas, nunca tocar código (criterio de extensibilidad del reto).
// Índice único parcial: solo una plantilla activa por producto+tipoEndoso -- evita que un query sin
// ORDER BY devuelva una fila no determinística si alguna vez hay 2 activas por error.
@Index('uq_active_template_per_product_type', ['product', 'endorsementType'], {
  unique: true,
  where: '"is_active" = true',
})
@Entity('templates')
export class TemplateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => EndorsementTypeEntity)
  @JoinColumn({ name: 'endorsement_type_id' })
  endorsementType: EndorsementTypeEntity;

  @Column({ default: 1 })
  version: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => TemplateDynamicFieldEntity, (field) => field.template, { cascade: true })
  dynamicFields: TemplateDynamicFieldEntity[];

  @OneToMany(() => TemplateEventAppliedEntity, (event) => event.template, { cascade: true })
  eventsApplied: TemplateEventAppliedEntity[];

  @OneToMany(() => TemplateStaticMappingEntity, (mapping) => mapping.template, { cascade: true })
  staticMappings: TemplateStaticMappingEntity[];
}

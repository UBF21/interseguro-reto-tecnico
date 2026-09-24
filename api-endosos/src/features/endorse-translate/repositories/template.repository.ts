import { TemplateConfig } from './template-config.dto';

// Puerto (DIP) -- el mapper/service dependen de esto, no de TypeORM directo.
export interface TemplateRepository {
  findActiveTemplate(productCode: string, endorsementTypeCode: string): Promise<TemplateConfig | null>;
}

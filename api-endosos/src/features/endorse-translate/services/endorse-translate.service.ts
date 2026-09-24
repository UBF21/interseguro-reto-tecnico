import { TemplateNotFoundException } from '../../../common/errors/domain-exception';
import { EndorseTranslateRequestDto, EndorseTranslateResponseDto } from '../dtos/endorse-translate.dto';
import { TemplateToJsonMapper } from '../mappers/template-to-json.mapper';
import { TemplateRepository } from '../repositories/template.repository';

export class EndorseTranslateService {
  constructor(
    private readonly templateRepository: TemplateRepository,
    private readonly mapper: TemplateToJsonMapper,
  ) {}

  async translate(input: EndorseTranslateRequestDto): Promise<EndorseTranslateResponseDto> {
    const config = await this.templateRepository.findActiveTemplate(input.producto, input.tipoEndoso);
    if (!config) throw new TemplateNotFoundException(input.producto, input.tipoEndoso);

    return this.mapper.map(input, config);
  }
}

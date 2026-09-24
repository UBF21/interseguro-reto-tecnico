import { ResponseToolkit } from '@hapi/hapi';
import { ApiResponse } from '../../../common/responses/api-response';
import { EndorseTranslateRequestDto } from '../dtos/endorse-translate.dto';
import { EndorseTranslateService } from '../services/endorse-translate.service';

export class EndorseTranslateController {
  constructor(private readonly service: EndorseTranslateService) {}

  translate = async (payload: EndorseTranslateRequestDto, h: ResponseToolkit) => {
    const result = await this.service.translate(payload);
    return h.response(ApiResponse.ok(result)).code(200);
  };
}

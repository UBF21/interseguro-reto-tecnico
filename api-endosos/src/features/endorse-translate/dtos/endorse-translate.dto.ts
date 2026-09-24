export interface EndorseTranslateRequestDto {
  policyNumber: string;
  idEnvio: number;
  producto: string;
  tipoEndoso: string;
  [key: string]: unknown;
}

export type EndorseTranslateResponseDto = Record<string, unknown>;

import { apiFetch } from '@/lib/http-client'

const ENDOSOS_API_URL = import.meta.env.VITE_ENDOSOS_API_URL ?? 'http://localhost:3001'

export interface EndorseTranslateRequest {
  policyNumber: string
  idEnvio: number
  producto: string
  tipoEndoso: string
  [key: string]: unknown
}

export type EndorseTranslateResponse = Record<string, unknown>

export async function translateEndorse(request: EndorseTranslateRequest): Promise<EndorseTranslateResponse> {
  return apiFetch<EndorseTranslateResponse>(ENDOSOS_API_URL, '/v1/endorse/translate', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

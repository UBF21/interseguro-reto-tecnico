import { apiFetch } from '@/lib/http-client'

const RUTAS_API_URL = import.meta.env.VITE_RUTAS_API_URL ?? 'http://localhost:8080'

export interface OptimalRouteRequest {
  accidentLocation: string
  depots: string[]
  graph: Record<string, Record<string, number>>
}

export interface OptimalRouteResponse {
  fromDepot: string
  to: string
  path: string[]
  distance: number
}

export async function findOptimalRoute(request: OptimalRouteRequest): Promise<OptimalRouteResponse> {
  return apiFetch<OptimalRouteResponse>(RUTAS_API_URL, '/v1/routes/optimal', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

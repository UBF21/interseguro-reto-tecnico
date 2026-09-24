import { afterEach, describe, expect, it, vi } from 'vitest'
import { findOptimalRoute } from './rutas.api'

describe('findOptimalRoute', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('posts the graph/depots/accidentLocation and returns the unwrapped route', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: null,
          code: null,
          data: { fromDepot: 'Miraflores', to: 'San Isidro', path: ['Miraflores', 'San Isidro'], distance: 7 },
        }),
        { status: 200 },
      ),
    )

    const result = await findOptimalRoute({
      accidentLocation: 'San Isidro',
      depots: ['Miraflores', 'Ate'],
      graph: { Miraflores: { 'San Isidro': 7 } },
    })

    expect(result.fromDepot).toBe('Miraflores')
    expect(result.distance).toBe(7)
  })
})

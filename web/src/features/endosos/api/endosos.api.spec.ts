import { afterEach, describe, expect, it, vi } from 'vitest'
import { translateEndorse } from './endosos.api'

describe('translateEndorse', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('posts the flat payload and returns the unwrapped structured JSON', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ success: true, message: null, code: null, data: { policyNumber: '1', eventEntity: {} } }),
        { status: 200 },
      ),
    )

    const result = await translateEndorse({ policyNumber: '1', idEnvio: 1, producto: 'Rumbo', tipoEndoso: 'X' })

    expect(result.policyNumber).toBe('1')
  })
})

import { describe, expect, it } from 'vitest'
import { queryClient } from './query-client'

describe('queryClient', () => {
  it('disables refetchOnWindowFocus and retries once', () => {
    const options = queryClient.getDefaultOptions()
    expect(options.queries?.retry).toBe(1)
    expect(options.queries?.refetchOnWindowFocus).toBe(false)
  })
})

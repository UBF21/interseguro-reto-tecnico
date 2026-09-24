import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMinLoadingDuration } from './useMinLoadingDuration'

describe('useMinLoadingDuration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is true immediately when isLoading becomes true', () => {
    const { result } = renderHook(({ isLoading }) => useMinLoadingDuration(isLoading, 500), {
      initialProps: { isLoading: true },
    })

    expect(result.current).toBe(true)
  })

  it('stays true for minMs after isLoading turns false', () => {
    const { result, rerender } = renderHook(({ isLoading }) => useMinLoadingDuration(isLoading, 500), {
      initialProps: { isLoading: true },
    })

    rerender({ isLoading: false })
    expect(result.current).toBe(true)

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe(false)
  })
})

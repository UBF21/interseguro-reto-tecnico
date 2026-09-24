import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePulseOnChange } from './usePulseOnChange'

describe('usePulseOnChange', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not pulse on the initial render', () => {
    const { result } = renderHook(({ value }) => usePulseOnChange(value, 500), {
      initialProps: { value: 'San Isidro' },
    })

    expect(result.current).toBe(false)
  })

  it('pulses true for ms after the value changes, then back to false', () => {
    const { result, rerender } = renderHook(({ value }) => usePulseOnChange(value, 500), {
      initialProps: { value: 'San Isidro' },
    })

    rerender({ value: 'Miraflores' })
    expect(result.current).toBe(true)

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe(false)
  })
})

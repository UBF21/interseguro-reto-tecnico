import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useJsonCrackReady } from './useJsonCrackReady'

describe('useJsonCrackReady', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('becomes ready when the widget posts its id from the matching origin', () => {
    const { result } = renderHook(() => useJsonCrackReady('https://jsoncrack.com', 'json-crack-embed'))
    expect(result.current.ready).toBe(false)

    act(() => {
      window.dispatchEvent(new MessageEvent('message', { origin: 'https://jsoncrack.com', data: 'json-crack-embed' }))
    })

    expect(result.current.ready).toBe(true)
  })

  it('ignores messages from a different origin', () => {
    const { result } = renderHook(() => useJsonCrackReady('https://jsoncrack.com', 'json-crack-embed'))

    act(() => {
      window.dispatchEvent(new MessageEvent('message', { origin: 'https://evil.example', data: 'json-crack-embed' }))
    })

    expect(result.current.ready).toBe(false)
  })

  it('becomes ready as a fallback shortly after handleLoad fires, if no ready ping arrived', () => {
    const { result } = renderHook(() => useJsonCrackReady('https://jsoncrack.com', 'json-crack-embed'))

    act(() => {
      result.current.handleLoad()
      vi.advanceTimersByTime(400)
    })

    expect(result.current.ready).toBe(true)
  })
})

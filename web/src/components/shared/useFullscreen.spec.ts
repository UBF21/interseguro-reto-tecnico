import { act, renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useFullscreen } from './useFullscreen'

function setup() {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const { result } = renderHook(() => {
    const ref = useRef<HTMLDivElement>(div)
    return useFullscreen(ref)
  })
  return { result, div }
}

describe('useFullscreen', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(document, 'fullscreenElement', { value: null, configurable: true })
  })

  it('requests fullscreen on the element when toggled and nothing is fullscreen yet', () => {
    const { result, div } = setup()
    const requestFullscreen = vi.fn()
    div.requestFullscreen = requestFullscreen

    act(() => result.current.toggle())

    expect(requestFullscreen).toHaveBeenCalledOnce()
  })

  it('exits fullscreen when something is already fullscreen', () => {
    const { result, div } = setup()
    Object.defineProperty(document, 'fullscreenElement', { value: div, configurable: true })
    const exitFullscreen = vi.fn()
    document.exitFullscreen = exitFullscreen

    act(() => result.current.toggle())

    expect(exitFullscreen).toHaveBeenCalledOnce()
  })

  it('tracks isFullscreen via the fullscreenchange event', () => {
    const { result, div } = setup()
    Object.defineProperty(document, 'fullscreenElement', { value: div, configurable: true })

    act(() => document.dispatchEvent(new Event('fullscreenchange')))

    expect(result.current.isFullscreen).toBe(true)
  })
})

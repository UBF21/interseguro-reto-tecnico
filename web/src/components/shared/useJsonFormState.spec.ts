import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useJsonFormState } from './useJsonFormState'

describe('useJsonFormState', () => {
  it('starts with the default value and calls onSubmit with the parsed JSON', () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() =>
      useJsonFormState({ defaultValue: '{"a":1}', parseErrorMessage: 'inválido', mutationError: null, onSubmit }),
    )

    expect(result.current.rawInput).toBe('{"a":1}')

    act(() => result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent))

    expect(onSubmit).toHaveBeenCalledWith({ a: 1 })
    expect(result.current.errorMessage).toBeNull()
  })

  it('sets a parse error and does not call onSubmit when the input is invalid JSON', () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() =>
      useJsonFormState({ defaultValue: '{{not-json', parseErrorMessage: 'inválido', mutationError: null, onSubmit }),
    )

    act(() => result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.errorMessage).toBe('inválido')
  })

  it('calls onRawInputChange when the raw input changes', () => {
    const onRawInputChange = vi.fn()
    const { result } = renderHook(() =>
      useJsonFormState({ defaultValue: '{}', parseErrorMessage: 'inválido', mutationError: null, onSubmit: vi.fn(), onRawInputChange }),
    )

    act(() => result.current.handleChangeRawInput('{"b":2}'))

    expect(result.current.rawInput).toBe('{"b":2}')
    expect(onRawInputChange).toHaveBeenCalledWith('{"b":2}')
  })

  it('falls back to the mutation error message when there is no parse error', () => {
    const { result } = renderHook(() =>
      useJsonFormState({ defaultValue: '{}', parseErrorMessage: 'inválido', mutationError: new Error('fallo del backend'), onSubmit: vi.fn() }),
    )

    expect(result.current.errorMessage).toBe('fallo del backend')
  })
})

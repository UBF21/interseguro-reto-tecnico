import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useTranslateEndosoMutation } from './use-translate-endoso'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useTranslateEndosoMutation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes the structured JSON as data on success', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true, message: null, code: null, data: { policyNumber: '1' } }), { status: 200 }),
    )

    const { result } = renderHook(() => useTranslateEndosoMutation(), { wrapper })
    result.current.mutate({ policyNumber: '1', idEnvio: 1, producto: 'Rumbo', tipoEndoso: 'X' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.policyNumber).toBe('1')
    expect(toast.success).toHaveBeenCalledWith('Endoso traducido correctamente.')
  })

  it('shows an error toast when the translation fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify({ message: 'Plantilla no encontrada' }), { status: 404 }))

    const { result } = renderHook(() => useTranslateEndosoMutation(), { wrapper })
    result.current.mutate({ policyNumber: '1', idEnvio: 1, producto: 'Rumbo', tipoEndoso: 'X' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalled()
  })
})

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useOptimalRouteMutation } from './use-optimal-route'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useOptimalRouteMutation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes the optimal route as data on success', async () => {
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

    const { result } = renderHook(() => useOptimalRouteMutation(), { wrapper })
    result.current.mutate({ accidentLocation: 'San Isidro', depots: ['Miraflores'], graph: {} })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.distance).toBe(7)
    expect(toast.success).toHaveBeenCalledWith('Ruta óptima calculada.')
  })

  it('shows an error toast when the calculation fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify({ message: 'Distrito inexistente' }), { status: 404 }))

    const { result } = renderHook(() => useOptimalRouteMutation(), { wrapper })
    result.current.mutate({ accidentLocation: 'San Isidro', depots: ['Miraflores'], graph: {} })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalled()
  })
})

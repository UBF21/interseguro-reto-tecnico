import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../store/auth.store'
import { useLoginMutation } from './use-login'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useLoginMutation', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, expiresAt: null })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logs the user into the store and shows a welcome toast on success', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: null,
          code: null,
          data: { accessToken: 'jwt', email: 'a@b.com', fullName: 'Ana Torres', roles: ['operator'], expiresInSeconds: 3600 },
        }),
        { status: 200 },
      ),
    )
    const { result } = renderHook(() => useLoginMutation(), { wrapper })

    result.current.mutate({ email: 'a@b.com', password: 'secret123' })

    await waitFor(() => expect(useAuthStore.getState().token).toBe('jwt'))
    expect(toast.success).toHaveBeenCalledWith('Bienvenido, Ana Torres.')
  })
})

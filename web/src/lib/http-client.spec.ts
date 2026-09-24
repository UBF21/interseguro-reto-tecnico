import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { apiFetch, ApiError } from './http-client'

describe('apiFetch', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('injects the Bearer token from the store when present', async () => {
    useAuthStore.setState({ token: 'jwt-123', user: null })
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true, message: null, code: null, data: { ok: true } }), { status: 200 }),
    )

    await apiFetch('http://api', '/v1/x')

    const [, init] = fetchSpy.mock.calls[0]
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer jwt-123')
  })

  it('does not send an Authorization header when logged out', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true, message: null, code: null, data: {} }), { status: 200 }),
    )

    await apiFetch('http://api', '/v1/x')

    const [, init] = fetchSpy.mock.calls[0]
    expect((init?.headers as Record<string, string>).Authorization).toBeUndefined()
  })

  it('returns the unwrapped data on success', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true, message: null, code: null, data: { hello: 'world' } }), { status: 200 }),
    )

    const result = await apiFetch<{ hello: string }>('http://api', '/v1/x')

    expect(result.hello).toBe('world')
  })

  it('throws ApiError with status and code when the envelope reports failure', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: false, message: 'no encontrado', code: 'NOT_FOUND', data: null }), { status: 404 }),
    )

    await expect(apiFetch('http://api', '/v1/x')).rejects.toMatchObject({
      message: 'no encontrado',
      status: 404,
      code: 'NOT_FOUND',
    })
  })

  it('throws ApiError when the HTTP status is not ok even if success is missing', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: false, message: null, code: null, data: null }), { status: 500 }),
    )

    await expect(apiFetch('http://api', '/v1/x')).rejects.toBeInstanceOf(ApiError)
  })

  it('calls logout() when the response is 401', async () => {
    useAuthStore.setState({ token: 'stale-token', user: { email: 'a@b.com', fullName: 'Ana', roles: [] }, expiresAt: 999 })
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: false, message: 'No autorizado', code: 'UNAUTHORIZED', data: null }), { status: 401 }),
    )

    await expect(apiFetch('http://api', '/v1/x')).rejects.toBeInstanceOf(ApiError)

    expect(useAuthStore.getState().token).toBeNull()
  })
})

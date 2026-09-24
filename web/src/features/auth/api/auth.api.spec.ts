import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, toAuthUser } from './auth.api'

describe('auth.api', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('login posts credentials and returns the unwrapped LoginResponse', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: null,
          code: null,
          data: { accessToken: 'jwt', email: 'a@b.com', fullName: 'Ana', roles: ['operator'], expiresInSeconds: 3600 },
        }),
        { status: 200 },
      ),
    )

    const result = await login({ email: 'a@b.com', password: 'secret123' })

    expect(result.accessToken).toBe('jwt')
  })

  it('toAuthUser maps a LoginResponse to the store AuthUser shape', () => {
    const user = toAuthUser({ accessToken: 'jwt', email: 'a@b.com', fullName: 'Ana', roles: ['operator'], expiresInSeconds: 3600 })

    expect(user).toEqual({ email: 'a@b.com', fullName: 'Ana', roles: ['operator'] })
  })
})

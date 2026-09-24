import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from './auth.store'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, expiresAt: null })
    vi.useRealTimers()
  })

  it('starts logged out', () => {
    expect(useAuthStore.getState().token).toBeNull()
  })

  it('login sets token, user and expiresAt', () => {
    useAuthStore.getState().login('jwt-token', { email: 'a@b.com', fullName: 'Ana', roles: ['operator'] }, 12345)

    expect(useAuthStore.getState().token).toBe('jwt-token')
    expect(useAuthStore.getState().user?.email).toBe('a@b.com')
    expect(useAuthStore.getState().expiresAt).toBe(12345)
  })

  it('logout clears token, user and expiresAt', () => {
    useAuthStore.getState().login('jwt-token', { email: 'a@b.com', fullName: 'Ana', roles: [] }, 12345)
    useAuthStore.getState().logout()

    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().expiresAt).toBeNull()
  })

  it('isExpired returns false when there is no expiresAt', () => {
    expect(useAuthStore.getState().isExpired()).toBe(false)
  })

  it('isExpired returns false before expiresAt', () => {
    vi.useFakeTimers()
    vi.setSystemTime(1_000_000)
    useAuthStore.getState().login('jwt-token', { email: 'a@b.com', fullName: 'Ana', roles: [] }, 1_000_000 + 60_000)

    expect(useAuthStore.getState().isExpired()).toBe(false)
  })

  it('isExpired returns true once past expiresAt', () => {
    vi.useFakeTimers()
    vi.setSystemTime(1_000_000)
    useAuthStore.getState().login('jwt-token', { email: 'a@b.com', fullName: 'Ana', roles: [] }, 1_000_000 + 60_000)

    vi.advanceTimersByTime(60_001)

    expect(useAuthStore.getState().isExpired()).toBe(true)
  })
})

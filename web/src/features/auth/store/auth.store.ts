import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  email: string
  fullName: string
  roles: string[]
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  expiresAt: number | null
  login: (token: string, user: AuthUser, expiresAt: number) => void
  logout: () => void
  isExpired: () => boolean
}

// Store por dominio (solo auth) -- consumir siempre con selector, nunca useAuthStore() a secas.
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      expiresAt: null,
      login: (token, user, expiresAt) => set({ token, user, expiresAt }),
      logout: () => set({ token: null, user: null, expiresAt: null }),
      isExpired: () => {
        const { expiresAt } = get()
        return expiresAt !== null && Date.now() >= expiresAt
      },
    }),
    { name: 'interseguro-auth' },
  ),
)

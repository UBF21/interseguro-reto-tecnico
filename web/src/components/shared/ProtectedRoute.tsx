import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth.store'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token)
  const isExpired = useAuthStore((state) => state.isExpired)
  const logout = useAuthStore((state) => state.logout)

  if (!token || isExpired()) {
    if (token) logout()
    return <Navigate to="/login" replace />
  }
  return children
}

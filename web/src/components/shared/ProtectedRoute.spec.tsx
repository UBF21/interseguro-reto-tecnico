import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { ProtectedRoute } from './ProtectedRoute'

function renderProtected() {
  return render(
    <MemoryRouter initialEntries={['/privado']}>
      <Routes>
        <Route path="/login" element={<p>pantalla de login</p>} />
        <Route
          path="/privado"
          element={
            <ProtectedRoute>
              <p>contenido privado</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, expiresAt: null })
  })

  it('redirects to /login when there is no token', () => {
    renderProtected()
    expect(screen.getByText('pantalla de login')).toBeInTheDocument()
  })

  it('renders children when a token is present and not expired', () => {
    useAuthStore.setState({ token: 'jwt', user: null, expiresAt: Date.now() + 60_000 })
    renderProtected()
    expect(screen.getByText('contenido privado')).toBeInTheDocument()
  })

  it('redirects to /login when the token is present but expired', () => {
    useAuthStore.setState({ token: 'jwt', user: null, expiresAt: Date.now() - 1 })
    renderProtected()
    expect(screen.getByText('pantalla de login')).toBeInTheDocument()
    expect(useAuthStore.getState().token).toBeNull()
  })
})

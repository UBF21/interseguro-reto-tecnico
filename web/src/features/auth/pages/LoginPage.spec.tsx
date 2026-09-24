import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { LoginPage } from './LoginPage'

function renderAt(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<p>home</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null })
  })

  it('shows the login form when logged out', () => {
    renderAt('/login')
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
  })

  it('redirects to home when already authenticated', () => {
    useAuthStore.setState({ token: 'jwt', user: null })
    renderAt('/login')
    expect(screen.getByText('home')).toBeInTheDocument()
  })
})

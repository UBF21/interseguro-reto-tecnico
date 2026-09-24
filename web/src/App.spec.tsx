import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { App } from './App'

describe('App', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null })
    window.history.pushState({}, '', '/')
  })

  it('redirects to /login when logged out and visiting a protected route', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
  })

  it('renders the home page cards when authenticated', () => {
    useAuthStore.setState({ token: 'jwt', user: { email: 'a@b.com', fullName: 'Ana', roles: [] } })
    render(<App />)
    expect(screen.getByRole('link', { name: /reto 1/i })).toBeInTheDocument()
  })
})

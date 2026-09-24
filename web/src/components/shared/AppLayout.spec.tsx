import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { AppLayout } from './AppLayout'

describe('AppLayout', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null })
  })

  it('renders children', () => {
    render(
      <MemoryRouter>
        <AppLayout>
          <p>contenido</p>
        </AppLayout>
      </MemoryRouter>,
    )
    expect(screen.getByText('contenido')).toBeInTheDocument()
  })

  it('shows a user menu trigger when authenticated', () => {
    useAuthStore.setState({ token: 'jwt', user: { email: 'a@b.com', fullName: 'Ana Torres', roles: ['operator'] } })
    render(
      <MemoryRouter>
        <AppLayout>
          <p>contenido</p>
        </AppLayout>
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: 'Menú de Ana Torres' })).toBeInTheDocument()
  })

  it('logout clears the store', async () => {
    useAuthStore.setState({ token: 'jwt', user: { email: 'a@b.com', fullName: 'Ana Torres', roles: ['operator'] } })
    render(
      <MemoryRouter>
        <AppLayout>
          <p>contenido</p>
        </AppLayout>
      </MemoryRouter>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Menú de Ana Torres' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: /cerrar sesión/i }))

    expect(useAuthStore.getState().token).toBeNull()
  })
})

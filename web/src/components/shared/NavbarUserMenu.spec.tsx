import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NavbarUserMenu } from './NavbarUserMenu'

describe('NavbarUserMenu', () => {
  it('shows the initials on the trigger circle', () => {
    render(<NavbarUserMenu fullName="Ana Torres" email="ana@interseguro.pe" onLogout={vi.fn()} />)

    expect(screen.getByText('AT')).toBeInTheDocument()
  })

  it('opens the panel with the full name, email, and role on click', async () => {
    render(<NavbarUserMenu fullName="Ana Torres" email="ana@interseguro.pe" role="operator" onLogout={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Menú de Ana Torres' }))

    expect(await screen.findByText('Ana Torres')).toBeInTheDocument()
    expect(screen.getByText('ana@interseguro.pe')).toBeInTheDocument()
    expect(screen.getByText('Operador')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /cerrar sesión/i })).toBeInTheDocument()
  })

  it('calls onLogout when the logout item is clicked', async () => {
    const onLogout = vi.fn()
    render(<NavbarUserMenu fullName="Ana Torres" email="ana@interseguro.pe" onLogout={onLogout} />)

    await userEvent.click(screen.getByRole('button', { name: 'Menú de Ana Torres' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: /cerrar sesión/i }))

    expect(onLogout).toHaveBeenCalledOnce()
  })
})

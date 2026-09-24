import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PasswordVisibilityToggle } from './PasswordVisibilityToggle'

describe('PasswordVisibilityToggle', () => {
  it('calls onToggle when clicked and labels itself for the current state', async () => {
    const onToggle = vi.fn()
    render(<PasswordVisibilityToggle visible={false} onToggle={onToggle} />)

    await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))

    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('shows the "hide" label when visible is true', () => {
    render(<PasswordVisibilityToggle visible={true} onToggle={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toBeInTheDocument()
  })

  it('disables the toggle when disabled is true', () => {
    render(<PasswordVisibilityToggle visible={false} onToggle={vi.fn()} disabled={true} />)

    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toBeDisabled()
  })
})

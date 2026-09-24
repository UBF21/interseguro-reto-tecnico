import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { PasswordField } from './PasswordField'

function Harness({ error, disabled }: { error?: string; disabled?: boolean }) {
  const { register } = useForm<{ password: string }>()
  return <PasswordField register={register('password')} error={error} disabled={disabled} />
}

describe('PasswordField', () => {
  it('accepts typed input', async () => {
    render(<Harness />)

    await userEvent.type(screen.getByLabelText('Contraseña'), 'secret123')

    expect(screen.getByLabelText('Contraseña')).toHaveValue('secret123')
  })

  it('hides the password by default and reveals it when the toggle is clicked', async () => {
    render(<Harness />)

    const input = screen.getByLabelText('Contraseña')
    expect(input).toHaveAttribute('type', 'password')

    await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))

    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toBeInTheDocument()
  })

  it('marks the input as invalid and shows the error message when error is set', () => {
    render(<Harness error="La contraseña debe tener al menos 8 caracteres." />)

    const input = screen.getByLabelText('Contraseña')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', 'password-error')
    expect(screen.getByRole('alert')).toHaveTextContent('La contraseña debe tener al menos 8 caracteres.')
  })

  it('disables the input and the visibility toggle when disabled is true', () => {
    render(<Harness disabled={true} />)

    expect(screen.getByLabelText('Contraseña')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toBeDisabled()
  })
})

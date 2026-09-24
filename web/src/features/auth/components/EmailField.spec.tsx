import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { EmailField } from './EmailField'

function Harness({ error, disabled }: { error?: string; disabled?: boolean }) {
  const { register } = useForm<{ email: string }>()
  return <EmailField register={register('email')} error={error} disabled={disabled} />
}

describe('EmailField', () => {
  it('accepts typed input', async () => {
    render(<Harness />)

    await userEvent.type(screen.getByLabelText('Correo'), 'a@b.com')

    expect(screen.getByLabelText('Correo')).toHaveValue('a@b.com')
  })

  it('marks the input as invalid and shows the error message when error is set', () => {
    render(<Harness error="Ingresá un correo válido." />)

    const input = screen.getByLabelText('Correo')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', 'email-error')
    expect(screen.getByRole('alert')).toHaveTextContent('Ingresá un correo válido.')
  })

  it('disables the input when disabled is true', () => {
    render(<Harness disabled={true} />)

    expect(screen.getByLabelText('Correo')).toBeDisabled()
  })
})

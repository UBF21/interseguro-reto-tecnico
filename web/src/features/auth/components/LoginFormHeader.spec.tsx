import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoginFormHeader } from './LoginFormHeader'

describe('LoginFormHeader', () => {
  it('renders the title and description', () => {
    render(<LoginFormHeader />)

    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
    expect(screen.getByText(/Reto Técnico Interseguro/)).toBeInTheDocument()
  })
})

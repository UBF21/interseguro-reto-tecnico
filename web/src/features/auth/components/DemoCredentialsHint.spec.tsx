import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DemoCredentialsHint } from './DemoCredentialsHint'

describe('DemoCredentialsHint', () => {
  it('shows the demo email and password', () => {
    render(<DemoCredentialsHint />)

    expect(screen.getByText('operaciones@interseguro.pe')).toBeInTheDocument()
    expect(screen.getByText('Reto2025!')).toBeInTheDocument()
  })
})

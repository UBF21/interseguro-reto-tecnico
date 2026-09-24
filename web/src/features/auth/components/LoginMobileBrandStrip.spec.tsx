import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoginMobileBrandStrip } from './LoginMobileBrandStrip'

describe('LoginMobileBrandStrip', () => {
  it('renders the product name', () => {
    render(<LoginMobileBrandStrip />)

    expect(screen.getByText('Interseguro · Operaciones')).toBeInTheDocument()
  })
})

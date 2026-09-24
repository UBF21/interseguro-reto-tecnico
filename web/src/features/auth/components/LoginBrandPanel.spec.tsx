import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoginBrandPanel } from './LoginBrandPanel'

describe('LoginBrandPanel', () => {
  it('renders the product name and pitch', () => {
    render(<LoginBrandPanel />)

    expect(screen.getByText('Interseguro · Operaciones')).toBeInTheDocument()
    expect(screen.getByText(/traducción de endosos/)).toBeInTheDocument()
  })
})

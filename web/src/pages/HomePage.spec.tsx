import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders a card linking to each reto', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /reto 1/i })).toHaveAttribute('href', '/endosos')
    expect(screen.getByRole('link', { name: /reto 2/i })).toHaveAttribute('href', '/rutas-optimas')
  })

  it('renders the Reto 3 card as a disabled placeholder pointing to docs/diagrams', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/diagrama de arquitectura/i)).toBeInTheDocument()
    expect(screen.getByText('Ver en docs/diagrams')).toBeInTheDocument()
  })
})

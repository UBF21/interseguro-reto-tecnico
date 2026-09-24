import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Breadcrumbs } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('links back to home and shows the current page as plain text', () => {
    render(
      <MemoryRouter>
        <Breadcrumbs currentLabel="Traductor de Endosos" />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /inicio/i })).toHaveAttribute('href', '/')
    expect(screen.getByText('Traductor de Endosos')).toBeInTheDocument()
  })
})

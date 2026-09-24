import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { RutasPage } from './RutasPage'

describe('RutasPage', () => {
  it('renders the title and the form', () => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RutasPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(screen.getByRole('heading', { name: /rutas óptimas/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /calcular ruta óptima/i })).toBeInTheDocument()
  })
})

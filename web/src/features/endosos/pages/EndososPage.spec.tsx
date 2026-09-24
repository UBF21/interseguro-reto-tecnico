import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { EndososPage } from './EndososPage'

describe('EndososPage', () => {
  it('renders the title and the form', () => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EndososPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(screen.getByRole('heading', { name: /traductor de endosos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /traducir endoso/i })).toBeInTheDocument()
  })
})

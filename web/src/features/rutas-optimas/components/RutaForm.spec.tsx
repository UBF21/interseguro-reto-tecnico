import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RutaForm } from './RutaForm'

function renderForm() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <RutaForm />
    </QueryClientProvider>,
  )
}

describe('RutaForm', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('submits the default PDF-example graph and shows the optimal route', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: null,
          code: null,
          data: { fromDepot: 'Miraflores', to: 'San Isidro', path: ['Miraflores', 'San Isidro'], distance: 7 },
        }),
        { status: 200 },
      ),
    )
    renderForm()

    await waitFor(() => expect(screen.getByRole('button', { name: /calcular ruta óptima/i })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: /calcular ruta óptima/i }))

    expect(await screen.findByTestId('json-result-viewer')).toHaveTextContent('"fromDepot": "Miraflores"')
  })

  it('shows a parse error when the graph is not valid JSON', async () => {
    const { container } = renderForm()
    await waitFor(() => expect(container.querySelector('.cm-content')).toBeInTheDocument())
    const editor = container.querySelector('.cm-content') as HTMLElement

    await userEvent.click(editor)
    await userEvent.keyboard('{Control>}a{/Control}{{not-json')
    await userEvent.click(screen.getByRole('button', { name: /calcular ruta óptima/i }))

    expect(await screen.findByText(/grafo no es un JSON válido/i)).toBeInTheDocument()
  })
})

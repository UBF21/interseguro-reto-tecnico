import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { EndosoForm } from './EndosoForm'

function renderForm() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <EndosoForm />
    </QueryClientProvider>,
  )
}

describe('EndosoForm', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('submits the default PDF-example payload and shows the structured result', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ success: true, message: null, code: null, data: { policyNumber: '08200000049' } }),
        { status: 200 },
      ),
    )
    renderForm()

    await waitFor(() => expect(screen.getByRole('button', { name: /traducir endoso/i })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: /traducir endoso/i }))

    expect(await screen.findByTestId('json-result-viewer')).toHaveTextContent('"policyNumber": "08200000049"')
  })

  it('shows a parse error when the input is not valid JSON', async () => {
    const { container } = renderForm()
    await waitFor(() => expect(container.querySelector('.cm-content')).toBeInTheDocument())
    const editor = container.querySelector('.cm-content') as HTMLElement

    await userEvent.click(editor)
    await userEvent.keyboard('{Control>}a{/Control}{{not-json')
    await userEvent.click(screen.getByRole('button', { name: /traducir endoso/i }))

    expect(await screen.findByText(/JSON de entrada no es válido/i)).toBeInTheDocument()
  })
})

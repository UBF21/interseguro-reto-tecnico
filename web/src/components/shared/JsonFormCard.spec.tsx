import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JsonFormCard } from './JsonFormCard'

function renderCard(overrides: Partial<React.ComponentProps<typeof JsonFormCard>> = {}) {
  const onSubmit = vi.fn()
  render(
    <JsonFormCard
      title="Título"
      textareaLabel="Entrada"
      defaultValue='{"a":1}'
      submitLabel="Enviar"
      pendingLabel="Enviando..."
      parseErrorMessage="JSON inválido."
      onSubmit={onSubmit}
      isPending={false}
      mutationError={null}
      result={null}
      resultTitle="Resultado"
      {...overrides}
    />,
  )
  return { onSubmit }
}

describe('JsonFormCard', () => {
  it('renders extraFields above the textarea', () => {
    renderCard({ extraFields: <p>campo extra</p> })
    expect(screen.getByText('campo extra')).toBeInTheDocument()
  })

  it('calls onSubmit with the parsed JSON', async () => {
    const { onSubmit } = renderCard()

    await waitFor(() => expect(screen.getByRole('button', { name: 'Enviar' })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(onSubmit).toHaveBeenCalledWith({ a: 1 })
  })

  it('shows parseErrorMessage on invalid JSON and role=alert', async () => {
    const { onSubmit } = renderCard({ defaultValue: '{{not-json' })

    await waitFor(() => expect(screen.getByRole('button', { name: 'Enviar' })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('JSON inválido.')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows mutationError message', () => {
    renderCard({ mutationError: new Error('fallo del backend') })
    expect(screen.getByRole('alert')).toHaveTextContent('fallo del backend')
  })

  it('shows the result via JsonResultViewer when present', async () => {
    renderCard({ result: { hello: 'world' } })
    expect(await screen.findByTestId('json-result-viewer')).toHaveTextContent('"hello": "world"')
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { JsonFormGrid } from './JsonFormGrid'

function renderGrid(overrides: Partial<React.ComponentProps<typeof JsonFormGrid>> = {}) {
  render(
    <JsonFormGrid
      title="Datos del endoso"
      textareaLabel="Entrada"
      rawInput='{"a":1}'
      onChangeRawInput={vi.fn()}
      submitLabel="Traducir endoso"
      pendingLabel="Traduciendo..."
      isPending={false}
      errorMessage={null}
      onSubmit={vi.fn((e) => e.preventDefault())}
      result={null}
      resultTitle="JSON estructurado (core)"
      {...overrides}
    />,
  )
}

describe('JsonFormGrid', () => {
  it('renders the input card and the empty-state result placeholder', () => {
    renderGrid()

    expect(screen.getByText('Datos del endoso')).toBeInTheDocument()
    expect(screen.getByText('El resultado va a aparecer acá.')).toBeInTheDocument()
  })

  it('renders the result column with data when a result is present', async () => {
    renderGrid({ result: { hello: 'world' } })

    expect(await screen.findByTestId('json-result-viewer')).toHaveTextContent('"hello": "world"')
  })
})

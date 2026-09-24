import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { JsonResultViewer } from './JsonResultViewer'

describe('JsonResultViewer', () => {
  it('renders the data as pretty-printed JSON by default', async () => {
    render(<JsonResultViewer data={{ policyNumber: '1' }} />)

    expect(await screen.findByTestId('json-result-viewer')).toHaveTextContent('"policyNumber": "1"')
  })

  it('switches to the diagram tab and renders the JSON Crack widget', async () => {
    render(<JsonResultViewer data={{ policyNumber: '1' }} />)

    await userEvent.click(screen.getByRole('tab', { name: 'Diagrama' }))

    expect(screen.getByTitle('Diagrama del JSON')).toBeInTheDocument()
  })

  it('renders extra tabs and switches to their content', async () => {
    render(
      <JsonResultViewer
        data={{ policyNumber: '1' }}
        extraTabs={[{ value: 'grafo', label: 'Grafo', content: <p>contenido del grafo</p> }]}
      />,
    )

    await userEvent.click(screen.getByRole('tab', { name: 'Grafo' }))

    expect(screen.getByText('contenido del grafo')).toBeInTheDocument()
  })
})

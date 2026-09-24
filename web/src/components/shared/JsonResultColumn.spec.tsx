import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { JsonResultColumn } from './JsonResultColumn'

describe('JsonResultColumn', () => {
  it('renders the placeholder when there is no result yet', () => {
    render(<JsonResultColumn title="JSON estructurado (core)" result={null} />)

    expect(screen.getByText('El resultado va a aparecer acá.')).toBeInTheDocument()
  })

  it('renders the result card with the JSON viewer when a result is present', async () => {
    render(<JsonResultColumn title="JSON estructurado (core)" result={{ hello: 'world' }} />)

    expect(await screen.findByTestId('json-result-viewer')).toHaveTextContent('"hello": "world"')
  })
})

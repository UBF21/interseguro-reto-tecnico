import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RouteGraphDiagram } from './RouteGraphDiagram'

const GRAPH = { Miraflores: { 'San Isidro': 7 }, 'San Isidro': { Miraflores: 7 } }

describe('RouteGraphDiagram', () => {
  it('renders the district nodes', () => {
    render(<RouteGraphDiagram graph={GRAPH} />)

    expect(screen.getByText('Miraflores')).toBeInTheDocument()
    expect(screen.getByText('San Isidro')).toBeInTheDocument()
  })

  it('renders the fullscreen toggle button', () => {
    render(<RouteGraphDiagram graph={GRAPH} />)

    expect(screen.getByRole('button', { name: 'Ver diagrama en pantalla completa' })).toBeInTheDocument()
  })
})

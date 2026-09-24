import { describe, expect, it } from 'vitest'
import { buildRouteGraphElements, parseRouteGraph } from './route-graph'

const GRAPH = {
  Miraflores: { 'San Isidro': 7, Barranco: 3 },
  'San Isidro': { Miraflores: 7 },
  Barranco: { Miraflores: 3 },
}

describe('parseRouteGraph', () => {
  it('parses a valid graph object', () => {
    expect(parseRouteGraph(JSON.stringify(GRAPH))).toEqual(GRAPH)
  })

  it('returns null for invalid JSON', () => {
    expect(parseRouteGraph('{{not-json')).toBeNull()
  })

  it('returns null for a JSON array (not a graph object)', () => {
    expect(parseRouteGraph('[1,2,3]')).toBeNull()
  })
})

describe('buildRouteGraphElements', () => {
  it('creates one node per district', () => {
    const { nodes } = buildRouteGraphElements(GRAPH)

    expect(nodes.map((n) => n.id).sort()).toEqual(['Barranco', 'Miraflores', 'San Isidro'])
  })

  it('dedupes symmetric edges into a single edge', () => {
    const { edges } = buildRouteGraphElements(GRAPH)

    expect(edges).toHaveLength(2)
  })

  it('marks the accident location node with the destructive style', () => {
    const { nodes } = buildRouteGraphElements(GRAPH, { accidentLocation: 'San Isidro' })

    expect(nodes.find((n) => n.id === 'San Isidro')?.className).toContain('border-destructive')
  })

  it('marks depot nodes with the primary style', () => {
    const { nodes } = buildRouteGraphElements(GRAPH, { depots: ['Miraflores'] })

    expect(nodes.find((n) => n.id === 'Miraflores')?.className).toContain('border-primary')
  })

  it('animates and accents edges that are part of the computed path', () => {
    const { edges } = buildRouteGraphElements(GRAPH, { path: ['Barranco', 'Miraflores', 'San Isidro'] })

    const onPath = edges.filter((e) => e.animated)
    expect(onPath).toHaveLength(2)
  })
})

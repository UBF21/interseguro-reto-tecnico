import type { Edge, Node } from '@xyflow/react'

export type RouteGraph = Record<string, Record<string, number>>

// Parsea el texto del editor a un grafo válido -- best effort, nunca lanza (se usa en cada
// keystroke para alimentar el diagrama en vivo, antes de que el usuario termine de escribir).
export function parseRouteGraph(rawInput: string): RouteGraph | null {
  try {
    const parsed = JSON.parse(rawInput)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as RouteGraph
    return null
  } catch {
    return null
  }
}

function edgeKey(a: string, b: string): string {
  return [a, b].sort().join('--')
}

function circularLayout(districts: string[]): Record<string, { x: number; y: number }> {
  const radius = Math.max(160, districts.length * 30)
  const center = { x: radius + 40, y: radius + 40 }
  const angleStep = (2 * Math.PI) / Math.max(districts.length, 1)
  const positions: Record<string, { x: number; y: number }> = {}
  districts.forEach((district, index) => {
    const angle = index * angleStep - Math.PI / 2
    positions[district] = { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) }
  })
  return positions
}

interface RouteGraphOptions {
  accidentLocation?: string
  depots?: string[]
  path?: string[]
}

function buildEdges(graph: RouteGraph, pathEdges: Set<string>): Edge[] {
  const seenEdges = new Set<string>()
  const edges: Edge[] = []
  for (const [from, neighbors] of Object.entries(graph)) {
    for (const [to, weight] of Object.entries(neighbors)) {
      const key = edgeKey(from, to)
      if (seenEdges.has(key) || !(to in graph)) continue
      seenEdges.add(key)
      const onPath = pathEdges.has(key)
      edges.push({
        id: key,
        source: from,
        target: to,
        label: String(weight),
        animated: onPath,
        style: { stroke: onPath ? 'var(--accent)' : 'var(--border)', strokeWidth: onPath ? 2.5 : 1.5 },
        labelStyle: { fill: 'var(--foreground)', fontSize: 12 },
      })
    }
  }
  return edges
}

export function buildRouteGraphElements(graph: RouteGraph, options: RouteGraphOptions = {}) {
  const districts = Object.keys(graph)
  const positions = circularLayout(districts)

  const pathEdges = new Set<string>()
  const path = options.path ?? []
  for (let i = 0; i < path.length - 1; i++) pathEdges.add(edgeKey(path[i], path[i + 1]))

  const nodes: Node[] = districts.map((district) => ({
    id: district,
    position: positions[district],
    data: { label: district },
    className: nodeClassName(district, options),
  }))

  return { nodes, edges: buildEdges(graph, pathEdges) }
}

function nodeClassName(district: string, options: RouteGraphOptions): string {
  if (options.accidentLocation === district) {
    return 'rounded-md border-2 border-destructive bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive'
  }
  if (options.depots?.includes(district)) {
    return 'rounded-md border-2 border-primary bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary'
  }
  return 'rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground'
}

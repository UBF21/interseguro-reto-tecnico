import { Background, Controls, ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMemo, useRef } from 'react'
import { FullscreenToggleButton } from '@/components/shared/FullscreenToggleButton'
import { useFullscreen } from '@/components/shared/useFullscreen'
import { buildRouteGraphElements, type RouteGraph } from '../lib/route-graph'

interface RouteGraphDiagramProps {
  graph: RouteGraph
  accidentLocation?: string
  depots?: string[]
  path?: string[]
}

// Grafo interactivo de distritos (React Flow) -- a diferencia del JSON Crack de Reto 1, acá los
// nodos y las aristas SON el dominio (distritos y distancias), no una vista genérica del JSON.
export function RouteGraphDiagram({ graph, accidentLocation, depots, path }: RouteGraphDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggle } = useFullscreen(containerRef)
  const { nodes, edges } = useMemo(
    () => buildRouteGraphElements(graph, { accidentLocation, depots, path }),
    [graph, accidentLocation, depots, path],
  )

  return (
    <div ref={containerRef} className="relative h-96 w-full overflow-hidden rounded-md border border-border bg-card">
      <FullscreenToggleButton isFullscreen={isFullscreen} onToggle={toggle} />
      <ReactFlow nodes={nodes} edges={edges} fitView nodesDraggable={false} nodesConnectable={false}>
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

export default RouteGraphDiagram

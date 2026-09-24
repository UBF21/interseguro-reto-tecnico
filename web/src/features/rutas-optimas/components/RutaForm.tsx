import { lazy, Suspense, useMemo, useState } from 'react'
import { JsonFormCard } from '@/components/shared/JsonFormCard'
import { usePulseOnChange } from '@/lib/usePulseOnChange'
import { useOptimalRouteMutation } from '../hooks/use-optimal-route'
import { parseRouteGraph } from '../lib/route-graph'
import { RutaFormFields } from './RutaFormFields'

// React Flow (RouteGraphDiagram) pesa ~200kB -- solo lo carga la página de Reto 2.
const RouteGraphDiagram = lazy(() => import('./RouteGraphDiagram'))
const GRAPH_DIAGRAM_FALLBACK = <div className="h-96 w-full animate-pulse rounded-md border border-border bg-muted" />

const DEFAULT_GRAPH = JSON.stringify(
  {
    Miraflores: { 'San Isidro': 7, Barranco: 3 },
    'San Isidro': { Miraflores: 7, Lince: 4 },
    Barranco: { Miraflores: 3, Surco: 5 },
    Lince: { 'San Isidro': 4, Surco: 6 },
    Surco: { Barranco: 5, Lince: 6, Ate: 10 },
    Ate: { Surco: 10 },
  },
  null,
  2,
)

export function RutaForm() {
  const [graphInput, setGraphInput] = useState(DEFAULT_GRAPH)
  const [accidentLocation, setAccidentLocation] = useState('')
  const [depots, setDepots] = useState<string[]>([])
  const { mutate, data, error, isPending } = useOptimalRouteMutation()
  // al cambiar de distrito, la config de la derecha (chips/tabs/diagrama) se re-arma --
  // este pulso muestra un esqueleto breve para que se note que está recalculando.
  const isReconfiguring = usePulseOnChange(accidentLocation, 450)

  const graph = useMemo(() => parseRouteGraph(graphInput), [graphInput])
  const districts = useMemo(() => (graph ? Object.keys(graph) : []), [graph])

  function handleSubmit(parsedGraph: unknown) {
    mutate({ accidentLocation, depots, graph: parsedGraph as Record<string, Record<string, number>> })
  }

  return (
    <JsonFormCard
      title="Datos del siniestro"
      textareaLabel="Grafo de distritos (JSON)"
      defaultValue={DEFAULT_GRAPH}
      submitLabel="Calcular ruta óptima"
      pendingLabel="Calculando..."
      parseErrorMessage="El grafo no es un JSON válido."
      onSubmit={handleSubmit}
      isPending={isPending}
      mutationError={error}
      result={data ?? null}
      resultTitle="Ruta óptima"
      onRawInputChange={setGraphInput}
      isResultLoading={isReconfiguring}
      extraFields={
        <RutaFormFields
          districts={districts}
          accidentLocation={accidentLocation}
          onChangeAccidentLocation={setAccidentLocation}
          depots={depots}
          onChangeDepots={setDepots}
          isReconfiguring={isReconfiguring}
        />
      }
      resultExtraTabs={
        graph
          ? [
              {
                value: 'grafo',
                label: 'Grafo',
                content: (
                  <Suspense fallback={GRAPH_DIAGRAM_FALLBACK}>
                    <RouteGraphDiagram graph={graph} accidentLocation={accidentLocation} depots={depots} path={data?.path} />
                  </Suspense>
                ),
              },
            ]
          : undefined
      }
    />
  )
}

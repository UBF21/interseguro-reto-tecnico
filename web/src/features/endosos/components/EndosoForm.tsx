import { JsonFormCard } from '@/components/shared/JsonFormCard'
import { useMinLoadingDuration } from '@/lib/useMinLoadingDuration'
import { useTranslateEndosoMutation } from '../hooks/use-translate-endoso'
import type { EndorseTranslateRequest } from '../api/endosos.api'

const DEFAULT_INPUT = JSON.stringify(
  {
    policyNumber: '08200000049',
    idEnvio: 5984,
    frecuencia: 'Semestral',
    tipoEndoso: 'CambioFrecuencia',
    producto: 'Rumbo',
    plan: 'PlanRumbo',
    moneda: 'Nuevo Sol',
    usuario: 'interface.servicios',
    fechaSolicitud: '2025-08-27',
    fechaCliente: '2025-08-27',
    fechaEfectiva: '2025-09-01',
  },
  null,
  2,
)

export function EndosoForm() {
  const { mutate, data, error, isPending } = useTranslateEndosoMutation()
  // delay mínimo visible en el botón -- evita que el spinner parpadee si el backend responde muy rápido
  const isPendingVisible = useMinLoadingDuration(isPending, 400)

  return (
    <JsonFormCard
      title="Datos del endoso (JSON plano)"
      textareaLabel="Entrada"
      defaultValue={DEFAULT_INPUT}
      submitLabel="Traducir endoso"
      pendingLabel="Traduciendo..."
      parseErrorMessage="El JSON de entrada no es válido."
      onSubmit={(parsed) => mutate(parsed as EndorseTranslateRequest)}
      isPending={isPendingVisible}
      mutationError={error}
      result={data ?? null}
      resultTitle="JSON estructurado (core)"
    />
  )
}

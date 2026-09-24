import type { ReactNode } from 'react'
import { JsonFormGrid } from './JsonFormGrid'
import { useJsonFormState } from './useJsonFormState'
import type { ResultTab } from './JsonResultViewer'

interface JsonFormCardProps<TResult> {
  title: string
  textareaLabel: string
  defaultValue: string
  submitLabel: string
  pendingLabel: string
  parseErrorMessage: string
  onSubmit: (parsed: unknown) => void
  isPending: boolean
  mutationError: Error | null
  result: TResult | null
  resultTitle: string
  extraFields?: ReactNode
  onRawInputChange?: (value: string) => void
  resultExtraTabs?: ResultTab[]
  isResultLoading?: boolean
}

// onRawInputChange/resultExtraTabs son opcionales -- RutaForm los usa para espejar el grafo
// tipeado y agregar la pestaña "Grafo" al panel de resultado, sin que EndosoForm sepa que existen.
export function JsonFormCard<TResult>({
  defaultValue,
  parseErrorMessage,
  onSubmit,
  mutationError,
  onRawInputChange,
  ...gridProps
}: JsonFormCardProps<TResult>) {
  const { rawInput, handleChangeRawInput, handleSubmit, errorMessage } = useJsonFormState({
    defaultValue,
    parseErrorMessage,
    mutationError,
    onSubmit,
    onRawInputChange,
  })

  return (
    <JsonFormGrid
      {...gridProps}
      rawInput={rawInput}
      onChangeRawInput={handleChangeRawInput}
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
      resultError={mutationError}
    />
  )
}

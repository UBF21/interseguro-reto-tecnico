import type { FormEvent, ReactNode } from 'react'
import { JsonInputCard } from './JsonInputCard'
import { JsonResultColumn } from './JsonResultColumn'
import type { ResultTab } from './JsonResultViewer'

interface JsonFormGridProps<TResult> {
  title: string
  textareaLabel: string
  rawInput: string
  onChangeRawInput: (value: string) => void
  submitLabel: string
  pendingLabel: string
  isPending: boolean
  errorMessage: string | null
  onSubmit: (e: FormEvent) => void
  extraFields?: ReactNode
  result: TResult | null
  resultTitle: string
  resultExtraTabs?: ResultTab[]
  resultError?: Error | null
  isResultLoading?: boolean
}

export function JsonFormGrid<TResult>(props: JsonFormGridProps<TResult>) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
      <JsonInputCard
        title={props.title}
        textareaLabel={props.textareaLabel}
        rawInput={props.rawInput}
        onChangeRawInput={props.onChangeRawInput}
        submitLabel={props.submitLabel}
        pendingLabel={props.pendingLabel}
        isPending={props.isPending}
        errorMessage={props.errorMessage}
        onSubmit={props.onSubmit}
        extraFields={props.extraFields}
      />
      <JsonResultColumn
        title={props.resultTitle}
        result={props.result}
        extraTabs={props.resultExtraTabs}
        error={props.resultError}
        isLoading={props.isResultLoading}
      />
    </div>
  )
}

import { lazy, Suspense } from 'react'
import { Label } from '@/components/ui/label'

// CodeMirror (JsonEditor) pesa ~600kB -- solo lo cargan las páginas de Reto 1/2, no el login/home.
const JsonEditor = lazy(() => import('./JsonEditor'))
const JSON_EDITOR_FALLBACK = <div className="h-64 w-full animate-pulse rounded-md border border-border bg-muted" />

interface JsonEditorFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  errorMessage: string | null
  onReady?: () => void
}

export function JsonEditorField({ label, value, onChange, errorMessage, onReady }: JsonEditorFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Suspense fallback={JSON_EDITOR_FALLBACK}>
        <JsonEditor
          value={value}
          onChange={onChange}
          label={label}
          hasError={!!errorMessage}
          describedById={errorMessage ? 'json-form-error' : undefined}
          onReady={onReady}
        />
      </Suspense>
      {errorMessage && (
        <p id="json-form-error" role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

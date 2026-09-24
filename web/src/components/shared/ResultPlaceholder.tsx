import { AlertTriangle, FileOutput } from 'lucide-react'

interface ResultPlaceholderProps {
  title: string
  error?: Error | null
}

export function ResultPlaceholder({ title, error }: ResultPlaceholderProps) {
  const isError = Boolean(error)

  return (
    <div
      className={`flex h-full min-h-80 flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center ${isError ? 'border-destructive/40' : 'border-border'}`}
    >
      <div className={`flex size-10 items-center justify-center rounded-lg ${isError ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
        {isError ? <AlertTriangle className="size-5" strokeWidth={1.75} aria-hidden="true" /> : <FileOutput className="size-5" strokeWidth={1.75} aria-hidden="true" />}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className={`mt-1 text-sm ${isError ? 'text-destructive' : 'text-muted-foreground'}`}>
          {isError ? 'No se pudo generar el resultado.' : 'El resultado va a aparecer acá.'}
        </p>
        {isError && error?.message && <p className="mt-1 text-xs text-muted-foreground">{error.message}</p>}
      </div>
    </div>
  )
}

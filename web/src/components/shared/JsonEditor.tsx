import { json, jsonParseLinter } from '@codemirror/lang-json'
import { linter, lintGutter } from '@codemirror/lint'
import CodeMirror from '@uiw/react-codemirror'
import { useEffect } from 'react'

interface JsonEditorProps {
  value: string
  onChange?: (value: string) => void
  label: string
  hasError?: boolean
  describedById?: string
  readOnly?: boolean
  testId?: string
  onReady?: () => void
}

// Editor con syntax highlighting + validación inline (CodeMirror, open source) -- reemplaza el
// textarea plano para que un JSON mal formado se vea marcado en el gutter antes de enviar el form.
// También se reusa en modo readOnly para mostrar el resultado con el mismo look que la entrada.
export function JsonEditor({ value, onChange, label, hasError = false, describedById, readOnly = false, testId, onReady }: JsonEditorProps) {
  // se dispara solo cuando el chunk lazy de CodeMirror ya montó -- el input card lo usa
  // para no dejar enviar el form mientras todavía se ve el esqueleto de carga.
  useEffect(() => {
    onReady?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      role="group"
      aria-label={label}
      aria-invalid={hasError}
      aria-describedby={describedById}
      data-testid={testId}
      className="overflow-hidden rounded-md border border-border data-invalid:border-destructive"
      data-invalid={hasError || undefined}
    >
      <CodeMirror
        value={value}
        height="256px"
        readOnly={readOnly}
        extensions={readOnly ? [json()] : [json(), linter(jsonParseLinter()), lintGutter()]}
        onChange={onChange}
        basicSetup={{ foldGutter: false }}
      />
    </div>
  )
}

export default JsonEditor

import { useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { JsonEditorField } from './JsonEditorField'

interface JsonInputCardProps {
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
}

export function JsonInputCard({
  title,
  textareaLabel,
  rawInput,
  onChangeRawInput,
  submitLabel,
  pendingLabel,
  isPending,
  errorMessage,
  onSubmit,
  extraFields,
}: JsonInputCardProps) {
  // el botón queda bloqueado hasta que el chunk lazy del editor termina de montar --
  // evita enviar mientras todavía se ve el esqueleto de carga del JSON de entrada.
  const [isEditorReady, setIsEditorReady] = useState(false)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {extraFields}
          <JsonEditorField
            label={textareaLabel}
            value={rawInput}
            onChange={onChangeRawInput}
            errorMessage={errorMessage}
            onReady={() => setIsEditorReady(true)}
          />
          <Button type="submit" disabled={isPending || !isEditorReady}>
            {isPending ? pendingLabel : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

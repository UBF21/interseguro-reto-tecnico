import type { UseFormRegisterReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EmailFieldProps {
  register: UseFormRegisterReturn
  error?: string
  disabled?: boolean
}

export function EmailField({ register, error, disabled }: EmailFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Correo</Label>
      <Input
        id="email"
        type="email"
        autoComplete="username"
        autoFocus
        aria-invalid={!!error}
        aria-describedby={error ? 'email-error' : undefined}
        disabled={disabled}
        className="h-11"
        {...register}
      />
      {error && (
        <p id="email-error" role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

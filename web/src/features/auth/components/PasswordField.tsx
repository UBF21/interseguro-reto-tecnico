import { useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordVisibilityToggle } from './PasswordVisibilityToggle'

interface PasswordFieldProps {
  register: UseFormRegisterReturn
  error?: string
  disabled?: boolean
}

export function PasswordField({ register, error, disabled }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="password">Contraseña</Label>
      <div className="relative">
        <Input
          id="password"
          type={visible ? 'text' : 'password'}
          autoComplete="current-password"
          aria-invalid={!!error}
          aria-describedby={error ? 'password-error' : undefined}
          disabled={disabled}
          className="h-11 pr-10"
          {...register}
        />
        <PasswordVisibilityToggle visible={visible} onToggle={() => setVisible((prev) => !prev)} disabled={disabled} />
      </div>
      {error && (
        <p id="password-error" role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

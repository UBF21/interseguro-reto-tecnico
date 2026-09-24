import { Eye, EyeOff } from 'lucide-react'

interface PasswordVisibilityToggleProps {
  visible: boolean
  onToggle: () => void
  disabled?: boolean
}

export function PasswordVisibilityToggle({ visible, onToggle, disabled }: PasswordVisibilityToggleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors duration-150 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
    >
      {visible ? <EyeOff className="size-4" strokeWidth={1.5} /> : <Eye className="size-4" strokeWidth={1.5} />}
    </button>
  )
}

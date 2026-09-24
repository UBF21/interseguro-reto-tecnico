import { Lock } from 'lucide-react'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginFormHeader() {
  return (
    <CardHeader className="justify-items-center gap-2.5 text-center">
      <div className="mb-1 flex size-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Lock className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <CardTitle className="text-2xl font-semibold tracking-tight">Iniciar sesión</CardTitle>
      <CardDescription className="[text-wrap:pretty]">
        Reto Técnico Interseguro — acceso a las herramientas de operación
      </CardDescription>
    </CardHeader>
  )
}

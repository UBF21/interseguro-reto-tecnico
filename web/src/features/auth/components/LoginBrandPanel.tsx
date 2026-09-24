import { ShieldCheck } from 'lucide-react'

export function LoginBrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative flex items-center gap-2 text-sm font-medium tracking-wide">
        <ShieldCheck className="size-5" strokeWidth={1.5} aria-hidden="true" />
        Interseguro · Operaciones
      </div>
      <div className="relative max-w-sm">
        <p className="text-2xl font-semibold leading-snug">
          Plataforma interna de traducción de endosos y cálculo de rutas óptimas.
        </p>
        <p className="mt-3 text-sm text-primary-foreground/70">Acceso restringido al personal de operaciones autorizado.</p>
      </div>
      <p className="relative text-xs text-primary-foreground/50">Reto Técnico Interseguro — Technical Lead</p>
    </div>
  )
}

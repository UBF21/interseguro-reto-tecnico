import { ShieldCheck } from 'lucide-react'

export function LoginMobileBrandStrip() {
  return (
    <div className="flex items-center justify-center gap-2 bg-primary py-4 text-sm font-medium text-primary-foreground lg:hidden">
      <ShieldCheck className="size-4" strokeWidth={1.5} aria-hidden="true" />
      Interseguro · Operaciones
    </div>
  )
}

const DEMO_EMAIL = 'operaciones@interseguro.pe'
const DEMO_PASSWORD = 'Reto2025!'

export function DemoCredentialsHint() {
  return (
    <div className="mt-2 border-t border-border pt-4 text-center text-xs text-muted-foreground">
      <p className="mb-1.5 font-medium tracking-wide uppercase">Credenciales demo</p>
      <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">{DEMO_EMAIL}</code>
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">{DEMO_PASSWORD}</code>
      </p>
    </div>
  )
}

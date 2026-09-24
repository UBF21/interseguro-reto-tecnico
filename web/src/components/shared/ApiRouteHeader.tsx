interface ApiRouteHeaderProps {
  title: string
  method: string
  path: string
}

export function ApiRouteHeader({ title, method, path }: ApiRouteHeaderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">
          {method}
        </span>
        <code className="font-mono text-sm text-muted-foreground">{path}</code>
      </div>
    </div>
  )
}

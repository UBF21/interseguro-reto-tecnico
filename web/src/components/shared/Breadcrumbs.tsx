import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BreadcrumbsProps {
  currentLabel: string
}

export function Breadcrumbs({ currentLabel }: BreadcrumbsProps) {
  return (
    <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link to="/" className="flex items-center gap-1 transition-colors hover:text-foreground">
        <Home className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
        Inicio
      </Link>
      <ChevronRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
      <span className="text-foreground">{currentLabel}</span>
    </nav>
  )
}

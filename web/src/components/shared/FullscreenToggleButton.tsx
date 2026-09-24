import { Maximize2, Minimize2 } from 'lucide-react'

interface FullscreenToggleButtonProps {
  isFullscreen: boolean
  onToggle: () => void
}

export function FullscreenToggleButton({ isFullscreen, onToggle }: FullscreenToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Ver diagrama en pantalla completa'}
      className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-md border border-border bg-card/90 text-muted-foreground shadow-sm transition-colors hover:text-foreground"
    >
      {isFullscreen ? (
        <Minimize2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Maximize2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
      )}
    </button>
  )
}

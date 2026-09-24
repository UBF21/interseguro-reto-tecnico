import { useEffect, useRef } from 'react'
import { FullscreenToggleButton } from './FullscreenToggleButton'
import { useFullscreen } from './useFullscreen'
import { useJsonCrackReady } from './useJsonCrackReady'

const JSON_CRACK_ORIGIN = 'https://jsoncrack.com'
const JSON_CRACK_WIDGET_URL = `${JSON_CRACK_ORIGIN}/widget`
const IFRAME_ID = 'json-crack-embed'

interface JsonCrackViewerProps {
  data: unknown
}

// Diagrama interactivo vía el widget público de JSON Crack (jsoncrack.com/docs), con un botón para
// verlo en pantalla completa (Fullscreen API nativa) -- el grafo se aprecia mucho mejor con espacio.
export function JsonCrackViewer({ data }: JsonCrackViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { ready, handleLoad } = useJsonCrackReady(JSON_CRACK_ORIGIN, IFRAME_ID)
  const { isFullscreen, toggle } = useFullscreen(containerRef)

  useEffect(() => {
    if (!ready) return
    iframeRef.current?.contentWindow?.postMessage(
      { json: JSON.stringify(data), options: { theme: 'light', direction: 'RIGHT' } },
      JSON_CRACK_ORIGIN,
    )
  }, [ready, data])

  return (
    <div ref={containerRef} className="relative h-96 w-full overflow-hidden rounded-md border border-border bg-card">
      <FullscreenToggleButton isFullscreen={isFullscreen} onToggle={toggle} />
      <iframe
        ref={iframeRef}
        id={IFRAME_ID}
        title="Diagrama del JSON"
        src={JSON_CRACK_WIDGET_URL}
        onLoad={handleLoad}
        className="h-full w-full border-0"
      />
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

const LOAD_FALLBACK_DELAY_MS = 400

// El widget de JSON Crack avisa que está listo posteando su propio id, pero ese ping puede
// perderse por una carrera de timing en React -- por eso además reintentamos un instante después
// del evento `load` del iframe, lo que llegue primero.
export function useJsonCrackReady(origin: string, iframeId: string) {
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin === origin && event.data === iframeId) setReady(true)
    }
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
      clearTimeout(loadTimeoutRef.current)
    }
  }, [origin, iframeId])

  function handleLoad() {
    loadTimeoutRef.current = setTimeout(() => setReady(true), LOAD_FALLBACK_DELAY_MS)
  }

  return { ready, handleLoad }
}

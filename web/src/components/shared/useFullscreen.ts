import { useEffect, useState, type RefObject } from 'react'

export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    function handleChange() {
      setIsFullscreen(document.fullscreenElement === ref.current)
    }
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [ref])

  function toggle() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      ref.current?.requestFullscreen?.()
    }
  }

  return { isFullscreen, toggle }
}

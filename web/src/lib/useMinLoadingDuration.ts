import { useEffect, useRef, useState } from 'react'

/** Mantiene `true` al menos `minMs` desde que `isLoading` se activó, aunque termine antes. */
export function useMinLoadingDuration(isLoading: boolean, minMs = 500) {
  const [visible, setVisible] = useState(isLoading)
  const startedAt = useRef<number | null>(null)

  useEffect(() => {
    if (isLoading) {
      startedAt.current = Date.now()
      setVisible(true)
      return
    }
    const elapsed = startedAt.current ? Date.now() - startedAt.current : minMs
    const timer = setTimeout(() => setVisible(false), Math.max(minMs - elapsed, 0))
    return () => clearTimeout(timer)
  }, [isLoading, minMs])

  return visible
}

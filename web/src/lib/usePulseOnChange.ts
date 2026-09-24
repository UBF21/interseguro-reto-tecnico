import { useEffect, useRef, useState } from 'react'

/** Se pone en `true` por `ms` cada vez que `value` cambia (no en el primer render). */
export function usePulseOnChange<T>(value: T, ms = 500) {
  const [pulsing, setPulsing] = useState(false)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    setPulsing(true)
    const timer = setTimeout(() => setPulsing(false), ms)
    return () => clearTimeout(timer)
  }, [value, ms])

  return pulsing
}

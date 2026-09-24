import { useState, type FormEvent } from 'react'

interface UseJsonFormStateOptions {
  defaultValue: string
  parseErrorMessage: string
  mutationError: Error | null
  onSubmit: (parsed: unknown) => void
  onRawInputChange?: (value: string) => void
}

export function useJsonFormState({ defaultValue, parseErrorMessage, mutationError, onSubmit, onRawInputChange }: UseJsonFormStateOptions) {
  const [rawInput, setRawInput] = useState(defaultValue)
  const [parseError, setParseError] = useState<string | null>(null)

  function handleChangeRawInput(value: string) {
    setRawInput(value)
    onRawInputChange?.(value)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      const parsed = JSON.parse(rawInput)
      setParseError(null)
      onSubmit(parsed)
    } catch {
      setParseError(parseErrorMessage)
    }
  }

  return { rawInput, handleChangeRawInput, handleSubmit, errorMessage: parseError ?? mutationError?.message ?? null }
}

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResultPlaceholder } from './ResultPlaceholder'

describe('ResultPlaceholder', () => {
  it('renders the given title and a waiting hint', () => {
    render(<ResultPlaceholder title="JSON estructurado (core)" />)

    expect(screen.getByText('JSON estructurado (core)')).toBeInTheDocument()
    expect(screen.getByText('El resultado va a aparecer acá.')).toBeInTheDocument()
  })
})

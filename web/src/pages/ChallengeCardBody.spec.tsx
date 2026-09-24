import { render, screen } from '@testing-library/react'
import { Route } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { ChallengeCardBody } from './ChallengeCardBody'

describe('ChallengeCardBody', () => {
  it('renders the eyebrow, title, and description', () => {
    render(
      <ChallengeCardBody
        icon={Route}
        eyebrow="Reto 2"
        title="Rutas Óptimas"
        description="Calcula la ruta más corta."
        disabled={false}
        delayMs={0}
      />,
    )

    expect(screen.getByText('Reto 2')).toBeInTheDocument()
    expect(screen.getByText('Rutas Óptimas')).toBeInTheDocument()
    expect(screen.getByText('Calcula la ruta más corta.')).toBeInTheDocument()
  })

  it('shows a badge when given one', () => {
    render(
      <ChallengeCardBody
        icon={Route}
        eyebrow="Reto 3"
        title="Arquitectura"
        description="Diagrama del sistema."
        badge="Próximamente"
        disabled={true}
        delayMs={0}
      />,
    )

    expect(screen.getByText('Próximamente')).toBeInTheDocument()
  })
})

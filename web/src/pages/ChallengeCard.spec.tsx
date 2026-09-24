import { render, screen } from '@testing-library/react'
import { Route } from 'lucide-react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ChallengeCard } from './ChallengeCard'

function renderCard(props: React.ComponentProps<typeof ChallengeCard>) {
  return render(
    <MemoryRouter>
      <ChallengeCard {...props} />
    </MemoryRouter>,
  )
}

describe('ChallengeCard', () => {
  it('renders as a link to the given route when "to" is set', () => {
    renderCard({ to: '/rutas-optimas', icon: Route, eyebrow: 'Reto 2', title: 'Rutas Óptimas', description: 'desc' })

    expect(screen.getByRole('link', { name: /rutas óptimas/i })).toHaveAttribute('href', '/rutas-optimas')
  })

  it('renders as a disabled, non-navigable block when "to" is omitted', () => {
    renderCard({ icon: Route, eyebrow: 'Reto 3', title: 'Arquitectura', description: 'desc', badge: 'Próximamente' })

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('Próximamente')).toBeInTheDocument()
  })
})

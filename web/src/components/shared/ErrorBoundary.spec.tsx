import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

function Bomb(): never {
  throw new Error('boom')
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children normally when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>contenido normal</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('contenido normal')).toBeInTheDocument()
  })

  it('renders the fallback UI when a child throws during render', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Algo salió mal.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /recargar/i })).toBeInTheDocument()
  })
})

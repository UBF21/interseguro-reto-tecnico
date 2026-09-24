import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ApiRouteHeader } from './ApiRouteHeader'

describe('ApiRouteHeader', () => {
  it('renders the title, method badge, and path', () => {
    render(<ApiRouteHeader title="Traductor de Endosos" method="POST" path="/v1/endorse/translate" />)

    expect(screen.getByRole('heading', { name: 'Traductor de Endosos' })).toBeInTheDocument()
    expect(screen.getByText('POST')).toBeInTheDocument()
    expect(screen.getByText('/v1/endorse/translate')).toBeInTheDocument()
  })
})

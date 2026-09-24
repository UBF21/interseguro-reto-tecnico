import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { JsonEditor } from './JsonEditor'

describe('JsonEditor', () => {
  it('renders the initial value and exposes an accessible group label', () => {
    render(<JsonEditor value='{"hola":"mundo"}' onChange={vi.fn()} label="JSON de entrada" hasError={false} />)

    const group = screen.getByRole('group', { name: 'JSON de entrada' })
    expect(group).toBeInTheDocument()
    expect(group).toHaveTextContent('"hola"')
  })

  it('marks the group as invalid when hasError is true', () => {
    render(<JsonEditor value="{}" onChange={vi.fn()} label="JSON de entrada" hasError={true} />)

    expect(screen.getByRole('group', { name: 'JSON de entrada' })).toHaveAttribute('aria-invalid', 'true')
  })
})

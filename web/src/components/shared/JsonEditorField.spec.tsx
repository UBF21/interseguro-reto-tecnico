import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { JsonEditorField } from './JsonEditorField'

describe('JsonEditorField', () => {
  it('renders the label and the JSON value once the lazy editor loads', async () => {
    render(<JsonEditorField label="Entrada" value='{"a":1}' onChange={vi.fn()} errorMessage={null} />)

    await waitFor(() => expect(screen.getByRole('group', { name: 'Entrada' })).toBeInTheDocument())
    expect(screen.getByRole('group', { name: 'Entrada' })).toHaveTextContent('"a"')
  })

  it('shows the error message as an alert linked to the editor', async () => {
    render(<JsonEditorField label="Entrada" value="{}" onChange={vi.fn()} errorMessage="JSON inválido." />)

    expect(await screen.findByRole('alert')).toHaveTextContent('JSON inválido.')
    expect(screen.getByRole('group', { name: 'Entrada' })).toHaveAttribute('aria-invalid', 'true')
  })
})

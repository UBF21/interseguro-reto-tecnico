import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JsonInputCard } from './JsonInputCard'

function renderCard(overrides: Partial<React.ComponentProps<typeof JsonInputCard>> = {}) {
  const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())
  render(
    <JsonInputCard
      title="Datos del endoso"
      textareaLabel="Entrada"
      rawInput='{"a":1}'
      onChangeRawInput={vi.fn()}
      submitLabel="Traducir endoso"
      pendingLabel="Traduciendo..."
      isPending={false}
      errorMessage={null}
      onSubmit={onSubmit}
      {...overrides}
    />,
  )
  return { onSubmit }
}

describe('JsonInputCard', () => {
  it('renders the title, extraFields, and submit label', () => {
    renderCard({ extraFields: <p>campo extra</p> })

    expect(screen.getByText('Datos del endoso')).toBeInTheDocument()
    expect(screen.getByText('campo extra')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Traducir endoso' })).toBeInTheDocument()
  })

  it('shows the pending label and disables the button while isPending', () => {
    renderCard({ isPending: true })

    expect(screen.getByRole('button', { name: 'Traduciendo...' })).toBeDisabled()
  })

  it('calls onSubmit when the form is submitted', async () => {
    const { onSubmit } = renderCard()

    await waitFor(() => expect(screen.getByRole('button', { name: 'Traducir endoso' })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: 'Traducir endoso' }))

    expect(onSubmit).toHaveBeenCalledOnce()
  })
})

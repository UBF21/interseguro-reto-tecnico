import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FullscreenToggleButton } from './FullscreenToggleButton'

describe('FullscreenToggleButton', () => {
  it('shows the "enter fullscreen" label and calls onToggle when not fullscreen', async () => {
    const onToggle = vi.fn()
    render(<FullscreenToggleButton isFullscreen={false} onToggle={onToggle} />)

    await userEvent.click(screen.getByRole('button', { name: 'Ver diagrama en pantalla completa' }))

    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('shows the "exit fullscreen" label when fullscreen', () => {
    render(<FullscreenToggleButton isFullscreen={true} onToggle={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Salir de pantalla completa' })).toBeInTheDocument()
  })
})

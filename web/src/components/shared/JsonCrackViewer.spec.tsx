import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { JsonCrackViewer } from './JsonCrackViewer'

describe('JsonCrackViewer', () => {
  it('renders an iframe pointing to the JSON Crack widget', () => {
    render(<JsonCrackViewer data={{ hola: 'mundo' }} />)

    const iframe = screen.getByTitle('Diagrama del JSON')
    expect(iframe).toHaveAttribute('src', 'https://jsoncrack.com/widget')
  })

  it('posts the JSON to the widget once it signals it is ready', async () => {
    render(<JsonCrackViewer data={{ hola: 'mundo' }} />)
    const iframe = screen.getByTitle('Diagrama del JSON') as HTMLIFrameElement
    const postMessage = vi.fn()
    Object.defineProperty(iframe, 'contentWindow', { value: { postMessage }, configurable: true })

    window.dispatchEvent(new MessageEvent('message', { origin: 'https://jsoncrack.com', data: 'json-crack-embed' }))

    await waitFor(() =>
      expect(postMessage).toHaveBeenCalledWith(
        { json: JSON.stringify({ hola: 'mundo' }), options: { theme: 'light', direction: 'RIGHT' } },
        'https://jsoncrack.com',
      ),
    )
  })

  it('ignores ready messages from a different origin', () => {
    render(<JsonCrackViewer data={{ hola: 'mundo' }} />)
    const iframe = screen.getByTitle('Diagrama del JSON') as HTMLIFrameElement
    const postMessage = vi.fn()
    Object.defineProperty(iframe, 'contentWindow', { value: { postMessage }, configurable: true })

    window.dispatchEvent(new MessageEvent('message', { origin: 'https://evil.example', data: 'json-crack-embed' }))

    expect(postMessage).not.toHaveBeenCalled()
  })
})

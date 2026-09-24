import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DepotsMultiSelect } from './DepotsMultiSelect'

describe('DepotsMultiSelect', () => {
  it('shows a checked checkbox for each selected depot', () => {
    render(<DepotsMultiSelect districts={['Miraflores', 'Ate']} value={['Miraflores']} onChange={vi.fn()} />)

    expect(screen.getByRole('checkbox', { name: 'Miraflores' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Ate' })).not.toBeChecked()
  })

  it('adds a district when its checkbox is checked', async () => {
    const onChange = vi.fn()
    render(<DepotsMultiSelect districts={['Miraflores', 'Ate']} value={['Miraflores']} onChange={onChange} />)

    await userEvent.click(screen.getByRole('checkbox', { name: 'Ate' }))

    expect(onChange).toHaveBeenCalledWith(['Miraflores', 'Ate'])
  })

  it('removes a district when its checkbox is unchecked', async () => {
    const onChange = vi.fn()
    render(<DepotsMultiSelect districts={['Miraflores', 'Ate']} value={['Miraflores', 'Ate']} onChange={onChange} />)

    await userEvent.click(screen.getByRole('checkbox', { name: 'Miraflores' }))

    expect(onChange).toHaveBeenCalledWith(['Ate'])
  })
})

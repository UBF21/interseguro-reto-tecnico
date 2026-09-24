import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DistrictSelect } from './DistrictSelect'

describe('DistrictSelect', () => {
  it('shows the current value and the label', () => {
    render(
      <DistrictSelect label="Distrito del accidente" districts={['Miraflores', 'San Isidro']} value="San Isidro" onChange={vi.fn()} />,
    )

    expect(screen.getByText('Distrito del accidente')).toBeInTheDocument()
    expect(screen.getByText('San Isidro')).toBeInTheDocument()
  })

  it('calls onChange with the picked district', async () => {
    const onChange = vi.fn()
    render(
      <DistrictSelect label="Distrito del accidente" districts={['Miraflores', 'San Isidro']} value="San Isidro" onChange={onChange} />,
    )

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(await screen.findByRole('option', { name: 'Miraflores' }))

    expect(onChange).toHaveBeenCalledWith('Miraflores')
  })
})

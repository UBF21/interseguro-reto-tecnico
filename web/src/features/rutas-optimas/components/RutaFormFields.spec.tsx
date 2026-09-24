import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RutaFormFields } from './RutaFormFields'

describe('RutaFormFields', () => {
  it('renders the district select and the depots multi-select', () => {
    render(
      <RutaFormFields
        districts={['Miraflores', 'Ate']}
        accidentLocation="Miraflores"
        onChangeAccidentLocation={vi.fn()}
        depots={['Ate']}
        onChangeDepots={vi.fn()}
      />,
    )

    expect(screen.getByText('Distrito del accidente')).toBeInTheDocument()
    expect(screen.getByText('Bases de grúas')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Ate' })).toBeChecked()
  })

  it('hides the depots chips until a district is selected', () => {
    render(
      <RutaFormFields
        districts={['Miraflores', 'Ate']}
        accidentLocation=""
        onChangeAccidentLocation={vi.fn()}
        depots={[]}
        onChangeDepots={vi.fn()}
      />,
    )

    expect(screen.queryByText('Bases de grúas')).not.toBeInTheDocument()
    expect(screen.getByText(/elegí el distrito del accidente/i)).toBeInTheDocument()
  })
})

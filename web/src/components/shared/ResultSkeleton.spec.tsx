import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResultSkeleton } from './ResultSkeleton'

describe('ResultSkeleton', () => {
  it('renders a placeholder card without exposing real content', () => {
    render(<ResultSkeleton />)

    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })
})

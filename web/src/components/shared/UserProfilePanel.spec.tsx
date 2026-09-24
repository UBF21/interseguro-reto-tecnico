import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DropdownMenu, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { UserProfilePanel } from './UserProfilePanel'

function renderPanel(props: React.ComponentProps<typeof UserProfilePanel>) {
  return render(
    <DropdownMenu open>
      <DropdownMenuContent>
        <UserProfilePanel {...props} />
      </DropdownMenuContent>
    </DropdownMenu>,
  )
}

describe('UserProfilePanel', () => {
  it('shows the initials, full name, and email', () => {
    renderPanel({ initials: 'AT', fullName: 'Ana Torres', email: 'ana@interseguro.pe', onLogout: vi.fn() })

    expect(screen.getByText('AT')).toBeInTheDocument()
    expect(screen.getByText('Ana Torres')).toBeInTheDocument()
    expect(screen.getByText('ana@interseguro.pe')).toBeInTheDocument()
  })

  it('shows a translated role badge when a role is given', () => {
    renderPanel({
      initials: 'AT',
      fullName: 'Ana Torres',
      email: 'ana@interseguro.pe',
      role: 'operator',
      onLogout: vi.fn(),
    })

    expect(screen.getByText('Operador')).toBeInTheDocument()
  })

  it('renders no role badge when role is omitted', () => {
    renderPanel({ initials: 'AT', fullName: 'Ana Torres', email: 'ana@interseguro.pe', onLogout: vi.fn() })

    expect(screen.queryByText('Operador')).not.toBeInTheDocument()
  })

  it('calls onLogout when the logout item is clicked', async () => {
    const onLogout = vi.fn()
    renderPanel({ initials: 'AT', fullName: 'Ana Torres', email: 'ana@interseguro.pe', onLogout })

    await userEvent.click(await screen.findByRole('menuitem', { name: /cerrar sesión/i }))

    expect(onLogout).toHaveBeenCalledOnce()
  })
})

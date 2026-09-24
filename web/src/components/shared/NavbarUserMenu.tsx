import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { UserProfilePanel } from './UserProfilePanel'

function initials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}

interface NavbarUserMenuProps {
  fullName: string
  email: string
  role?: string
  onLogout: () => void
}

export function NavbarUserMenu({ fullName, email, role, onLogout }: NavbarUserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Menú de ${fullName}`}
        className="flex size-9 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent outline-none transition-colors hover:bg-accent/20 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {initials(fullName)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-64 p-2">
        <UserProfilePanel initials={initials(fullName)} fullName={fullName} email={email} role={role} onLogout={onLogout} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

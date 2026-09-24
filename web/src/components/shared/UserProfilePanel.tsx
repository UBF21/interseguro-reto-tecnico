import { LogOut } from 'lucide-react'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

const KNOWN_ROLE_LABELS: Record<string, string> = { operator: 'Operador' }

function roleLabel(role: string): string {
  return KNOWN_ROLE_LABELS[role] ?? role.charAt(0).toUpperCase() + role.slice(1)
}

interface UserProfilePanelProps {
  initials: string
  fullName: string
  email: string
  role?: string
  onLogout: () => void
}

export function UserProfilePanel({ initials, fullName, email, role, onLogout }: UserProfilePanelProps) {
  return (
    <>
      <div className="flex items-center gap-3 px-1.5 py-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{fullName}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
      </div>
      {role && (
        <div className="px-1.5 pb-2">
          <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
            {roleLabel(role)}
          </span>
        </div>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onClick={onLogout} className="mt-1">
        <LogOut className="size-4" strokeWidth={1.75} aria-hidden="true" />
        Cerrar sesión
      </DropdownMenuItem>
    </>
  )
}

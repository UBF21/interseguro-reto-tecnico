import { ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { NavbarUserMenu } from './NavbarUserMenu'

export function AppLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
    toast.success('Sesión cerrada.')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
        <Link to="/" className="flex items-center gap-2 text-base font-semibold text-primary">
          <ShieldCheck className="size-5" strokeWidth={1.75} aria-hidden="true" />
          Interseguro <span className="font-normal text-muted-foreground">· Operaciones</span>
        </Link>
        {user && (
          <NavbarUserMenu fullName={user.fullName} email={user.email} role={user.roles[0]} onLogout={handleLogout} />
        )}
      </header>
      <main className="w-full px-6 py-10 sm:px-10 lg:px-16 xl:px-20">{children}</main>
    </div>
  )
}

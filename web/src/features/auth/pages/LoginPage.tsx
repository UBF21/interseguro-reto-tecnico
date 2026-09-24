import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { LoginBrandPanel } from '../components/LoginBrandPanel'
import { LoginForm } from '../components/LoginForm'
import { LoginMobileBrandStrip } from '../components/LoginMobileBrandStrip'

export function LoginPage() {
  const token = useAuthStore((state) => state.token)

  if (token) return <Navigate to="/" replace />

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      <LoginBrandPanel />
      <div className="flex flex-col">
        <LoginMobileBrandStrip />
        <div className="flex flex-1 items-center justify-center bg-background p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

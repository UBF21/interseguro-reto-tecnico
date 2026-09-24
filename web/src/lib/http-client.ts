import { toast } from 'sonner'
import { useAuthStore } from '@/features/auth/store/auth.store'

export class ApiError extends Error {
  readonly status: number
  readonly code: string | null

  constructor(message: string, status: number, code: string | null) {
    super(message)
    this.status = status
    this.code = code
  }
}

interface ApiEnvelope<T> {
  success: boolean
  message: string | null
  code: string | null
  data: T | null
}

// Wrapper de fetch que inyecta el Bearer token del store en cada request y desenvuelve ApiResponse<T>.
export async function apiFetch<T>(baseUrl: string, path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  const body = (await response.json()) as ApiEnvelope<T>

  if (response.status === 401) {
    // Token vencido o inválido -- limpiamos la sesión acá mismo para que cualquier caller
    // (login, endosos, rutas) deje al usuario en estado consistente sin lógica repetida.
    const hadSession = useAuthStore.getState().token !== null
    useAuthStore.getState().logout()
    if (hadSession) {
      toast.error('Tu sesión expiró. Iniciá sesión de nuevo.')
    }
  }

  if (!response.ok || !body.success) {
    throw new ApiError(body.message ?? 'Error inesperado', response.status, body.code)
  }

  return body.data as T
}

import { apiFetch } from '@/lib/http-client'
import type { AuthUser } from '../store/auth.store'

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:5000'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  email: string
  fullName: string
  roles: string[]
  expiresInSeconds: number
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(AUTH_API_URL, '/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export function toAuthUser(response: LoginResponse): AuthUser {
  return { email: response.email, fullName: response.fullName, roles: response.roles }
}

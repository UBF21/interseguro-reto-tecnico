import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../store/auth.store'
import { LoginForm } from './LoginForm'

function renderLoginForm() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>,
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('submits email/password and logs the user in on success', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: null,
          code: null,
          data: { accessToken: 'jwt', email: 'a@b.com', fullName: 'Ana', roles: [], expiresInSeconds: 3600 },
        }),
        { status: 200 },
      ),
    )
    renderLoginForm()

    await userEvent.type(screen.getByLabelText('Correo'), 'a@b.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'secret123')
    await waitFor(() => expect(screen.getByRole('button', { name: /ingresar/i })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    await vi.waitFor(() => expect(useAuthStore.getState().token).toBe('jwt'))
  })

  it('keeps the submit button disabled until email and password pass validation', async () => {
    renderLoginForm()

    expect(screen.getByRole('button', { name: /ingresar/i })).toBeDisabled()

    await userEvent.type(screen.getByLabelText('Correo'), 'no-es-un-email')
    await userEvent.type(screen.getByLabelText('Contraseña'), '123')
    await userEvent.tab()

    expect(await screen.findByText('Ingresá un correo válido.')).toBeInTheDocument()
    expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeDisabled()
  })

  it('shows the error message when login fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: false, message: 'Usuario o contraseña incorrectos.', code: 'INVALID_CREDENTIALS', data: null }), {
        status: 401,
      }),
    )
    renderLoginForm()

    await userEvent.type(screen.getByLabelText('Correo'), 'a@b.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'wrongpass')
    await waitFor(() => expect(screen.getByRole('button', { name: /ingresar/i })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    expect(await screen.findByText('Usuario o contraseña incorrectos.')).toBeInTheDocument()
  })
})

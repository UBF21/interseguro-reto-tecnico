import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { login, toAuthUser } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

export function useLoginMutation() {
  const storeLogin = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const user = toAuthUser(response)
      storeLogin(response.accessToken, user, Date.now() + response.expiresInSeconds * 1000)
      toast.success(`Bienvenido, ${user.fullName}.`)
    },
  })
}

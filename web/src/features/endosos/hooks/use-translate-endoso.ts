import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { translateEndorse } from '../api/endosos.api'

export function useTranslateEndosoMutation() {
  return useMutation({
    mutationFn: translateEndorse,
    onSuccess: () => toast.success('Endoso traducido correctamente.'),
    onError: (error) => toast.error(error.message || 'No se pudo traducir el endoso.'),
  })
}

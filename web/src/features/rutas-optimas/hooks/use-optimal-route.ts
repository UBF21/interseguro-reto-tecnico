import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { findOptimalRoute } from '../api/rutas.api'

export function useOptimalRouteMutation() {
  return useMutation({
    mutationFn: findOptimalRoute,
    onSuccess: () => toast.success('Ruta óptima calculada.'),
    onError: (error) => toast.error(error.message || 'No se pudo calcular la ruta.'),
  })
}

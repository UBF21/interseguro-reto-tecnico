import { ApiRouteHeader } from '@/components/shared/ApiRouteHeader'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { RutaForm } from '../components/RutaForm'

export function RutasPage() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs currentLabel="Rutas Óptimas" />
      <ApiRouteHeader title="Rutas Óptimas" method="POST" path="/v1/routes/optimal" />
      <RutaForm />
    </div>
  )
}

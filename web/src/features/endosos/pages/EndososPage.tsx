import { ApiRouteHeader } from '@/components/shared/ApiRouteHeader'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { EndosoForm } from '../components/EndosoForm'

export function EndososPage() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs currentLabel="Traductor de Endosos" />
      <ApiRouteHeader title="Traductor de Endosos" method="POST" path="/v1/endorse/translate" />
      <EndosoForm />
    </div>
  )
}

import { FileJson, Route, Workflow } from 'lucide-react'
import { ChallengeCard } from './ChallengeCard'

export function HomePage() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ChallengeCard
        to="/endosos"
        icon={FileJson}
        eyebrow="Reto 1"
        title="Traductor de Endosos"
        description="Convierte un JSON plano de endoso en la estructura que espera el core, usando la plantilla configurada en BD."
        delayMs={0}
      />
      <ChallengeCard
        to="/rutas-optimas"
        icon={Route}
        eyebrow="Reto 2"
        title="Rutas Óptimas"
        description="Calcula la ruta más corta desde la base de grúa más cercana hasta el distrito del siniestro."
        delayMs={75}
      />
      <ChallengeCard
        icon={Workflow}
        eyebrow="Reto 3"
        title="Diagrama de Arquitectura"
        description="Vista general de los servicios, la autenticación compartida y el flujo de datos del sistema."
        badge="Ver en docs/diagrams"
        delayMs={150}
      />
    </div>
  )
}

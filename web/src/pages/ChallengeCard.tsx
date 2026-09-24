import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ChallengeCardBody } from './ChallengeCardBody'

interface ChallengeCardProps {
  to?: string
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  badge?: string
  delayMs?: number
}

export function ChallengeCard({ to, delayMs = 0, ...body }: ChallengeCardProps) {
  const card = <ChallengeCardBody {...body} disabled={!to} delayMs={delayMs} />

  if (!to) return <div aria-disabled="true">{card}</div>
  return (
    <Link to={to} className="block h-full">
      {card}
    </Link>
  )
}

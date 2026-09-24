import type { LucideIcon } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChallengeCardBodyProps {
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  badge?: string
  disabled: boolean
  delayMs: number
}

export function ChallengeCardBody({ icon: Icon, eyebrow, title, description, badge, disabled, delayMs }: ChallengeCardBodyProps) {
  return (
    <Card
      className={cn(
        'h-full animate-in fade-in-0 slide-in-from-bottom-2 border-border shadow-sm duration-500 fill-mode-both',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md active:translate-y-0',
      )}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <CardHeader>
        <div className="mb-1 flex items-center justify-between">
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </div>
          {badge && (
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{eyebrow}</p>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

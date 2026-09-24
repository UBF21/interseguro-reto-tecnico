import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { JsonResultViewer, type ResultTab } from './JsonResultViewer'
import { ResultPlaceholder } from './ResultPlaceholder'
import { ResultSkeleton } from './ResultSkeleton'

interface JsonResultColumnProps {
  title: string
  result: unknown
  extraTabs?: ResultTab[]
  error?: Error | null
  isLoading?: boolean
}

export function JsonResultColumn({ title, result, extraTabs, error, isLoading }: JsonResultColumnProps) {
  if (isLoading) return <ResultSkeleton />
  if (!result) return <ResultPlaceholder title={title} error={error} />

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <JsonResultViewer data={result} extraTabs={extraTabs} />
      </CardContent>
    </Card>
  )
}

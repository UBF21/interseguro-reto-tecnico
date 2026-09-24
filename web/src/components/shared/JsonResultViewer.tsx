import { lazy, Suspense, type ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JsonCrackViewer } from './JsonCrackViewer'

const JsonEditor = lazy(() => import('./JsonEditor'))
const JSON_VIEWER_FALLBACK = <div className="h-64 w-full animate-pulse rounded-md border border-border bg-muted" />

export interface ResultTab {
  value: string
  label: string
  content: ReactNode
}

interface JsonResultViewerProps {
  data: unknown
  extraTabs?: ResultTab[]
}

export function JsonResultViewer({ data, extraTabs = [] }: JsonResultViewerProps) {
  return (
    <Tabs defaultValue="json">
      <TabsList>
        <TabsTrigger value="json">JSON</TabsTrigger>
        <TabsTrigger value="diagram">Diagrama</TabsTrigger>
        {extraTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="json">
        <Suspense fallback={JSON_VIEWER_FALLBACK}>
          <JsonEditor value={JSON.stringify(data, null, 2)} label="Resultado" readOnly testId="json-result-viewer" />
        </Suspense>
      </TabsContent>
      <TabsContent value="diagram">
        <JsonCrackViewer data={data} />
      </TabsContent>
      {extraTabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

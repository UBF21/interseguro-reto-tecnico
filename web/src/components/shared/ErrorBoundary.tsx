import { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-lg font-medium text-foreground">Algo salió mal.</p>
          <p className="text-sm text-muted-foreground">Recarga la página para continuar.</p>
          <Button onClick={() => window.location.reload()}>Recargar</Button>
        </div>
      )
    }
    return this.props.children
  }
}

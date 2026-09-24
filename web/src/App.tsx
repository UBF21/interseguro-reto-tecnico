import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/shared/AppLayout'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { Toaster } from '@/components/ui/sonner'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { EndososPage } from '@/features/endosos/pages/EndososPage'
import { RutasPage } from '@/features/rutas-optimas/pages/RutasPage'
import { queryClient } from '@/lib/query-client'
import { HomePage } from '@/pages/HomePage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/endosos"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EndososPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rutas-optimas"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RutasPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

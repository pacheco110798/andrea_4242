import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router'

import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { ProtectedRoute, PublicOnlyRoute } from './features/auth/route-guards'

// The dashboard pulls in the chart library, so it is loaded only after login.
const DashboardPage = lazy(() =>
  import('./features/dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)

export function App() {
  return (
    <Suspense fallback={<p className="page-loading">Cargando…</p>}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

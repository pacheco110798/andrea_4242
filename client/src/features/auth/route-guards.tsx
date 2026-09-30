import { Navigate, Outlet } from 'react-router'

import { useAuth } from './useAuth'

/** Only renders nested routes when there is an active session. */
export function ProtectedRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

/** Login and register pages redirect to the dashboard if already logged in. */
export function PublicOnlyRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}

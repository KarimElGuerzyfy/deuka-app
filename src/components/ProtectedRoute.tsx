import { Navigate, Outlet } from 'react-router-dom'

// Redirects unauthenticated users away from protected routes
export default function ProtectedRoute() {
  const isAuthenticated = false // temporary — Supabase auth replaces this later

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />
}
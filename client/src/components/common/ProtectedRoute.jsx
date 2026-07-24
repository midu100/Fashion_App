import React from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthContext'

// ====== Role gate for /admin — store-less, waits for the profile restore ======
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  // ====== Still restoring the session → hold with a spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-[13px] font-ui tracking-[0.3em] text-cream-muted uppercase animate-pulse">
          Loading…
        </p>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/signin" state={{ from: location }} replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" replace />

  return children ? children : null
}

export default ProtectedRoute

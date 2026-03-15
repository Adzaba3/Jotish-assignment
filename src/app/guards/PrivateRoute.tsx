import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'

interface PrivateRouteProps {
  children: React.ReactElement
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthed } = useAuth()

  if (!isAuthed) {
    return <Navigate to="/login" replace />
  }

  return children
}

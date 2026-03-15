import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateRoute } from './guards/PrivateRoute'
import { LoginPage } from '../features/auth/LoginPage'
import { ListPage } from '../features/list/ListPage'
import { DetailsPage } from '../features/details/DetailsPage'
import { AnalyticsPage } from '../features/analytics/AnalyticsPage'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/list" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/list"
        element={
          <PrivateRoute>
            <ListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/details/:id"
        element={
          <PrivateRoute>
            <DetailsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <AnalyticsPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/list" replace />} />
    </Routes>
  )
}

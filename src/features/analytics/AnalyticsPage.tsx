import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { fetchEmployees } from '../../services/api'
import { Employee } from '../../types/employee'
import { SalaryChart } from './SalaryChart'
import { GeoMap } from './GeoMap'

export const AnalyticsPage: React.FC = () => {
  const { logout } = useAuth()
  const [rows, setRows] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [auditImage, setAuditImage] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('audit_image')
    if (stored) setAuditImage(stored)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    fetchEmployees(controller.signal)
      .then((data) => {
        setRows(data)
        setError('')
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Failed to load analytics data.')
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [])

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <strong>Analytics</strong>
          <span className="muted">Photo + graph + map</span>
        </div>
        <nav className="nav">
          <Link to="/list">List</Link>
          <button className="ghost" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      <section className="card">
        <h2>Photo result + visualizations</h2>
        <p className="muted">Audit image, SVG chart, and simple geo map.</p>

        <div className="analytics-grid">
          <div className="panel">
            <h3>Audit image</h3>
            {auditImage ? (
              <img src={auditImage} alt="Audit" className="audit-image" />
            ) : (
              <div className="placeholder">Capture and merge a photo in Details.</div>
            )}
          </div>

          <div className="panel">
            <h3>Salary distribution</h3>
            {isLoading && <div className="placeholder">Loading chart...</div>}
            {error && !isLoading && <div className="error">{error}</div>}
            {!isLoading && !error && <SalaryChart data={rows} />}
          </div>
        </div>

        <div className="panel">
          <h3>Geospatial mapping</h3>
          {isLoading && <div className="placeholder">Loading map...</div>}
          {error && !isLoading && <div className="error">{error}</div>}
          {!isLoading && !error && <GeoMap data={rows} />}
        </div>
      </section>
    </div>
  )
}

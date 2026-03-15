import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export const AnalyticsPage: React.FC = () => {
  const { logout } = useAuth()

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
        <p className="muted">SVG chart and map coming next.</p>
        <div className="placeholder">Audit image + chart + map</div>
      </section>
    </div>
  )
}

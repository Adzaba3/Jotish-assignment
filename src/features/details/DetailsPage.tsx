import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { logout } = useAuth()

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <strong>Employee Details</strong>
          <span className="muted">ID: {id}</span>
        </div>
        <nav className="nav">
          <Link to="/list">List</Link>
          <Link to="/analytics">Analytics</Link>
          <button className="ghost" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      <section className="card">
        <h2>Identity verification</h2>
        <p className="muted">Camera + signature canvas coming next.</p>
        <div className="placeholder">Camera + signature area</div>
      </section>
    </div>
  )
}

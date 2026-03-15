import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export const ListPage: React.FC = () => {
  const { logout, user } = useAuth()

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <strong>Employee Insights</strong>
          <span className="muted">Signed in: {user?.username}</span>
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
        <h2>Employee list</h2>
        <p className="muted">API + custom virtualization coming next.</p>
        <div className="placeholder">Virtualized table</div>
      </section>
    </div>
  )
}

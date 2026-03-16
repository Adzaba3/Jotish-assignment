import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { fetchEmployees } from '../../services/api'
import { Employee } from '../../types/employee'
import { VirtualList } from './VirtualList'

export const ListPage: React.FC = () => {
  const { logout, user } = useAuth()
  const [rows, setRows] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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
        setError(err.message || 'Failed to load employees.')
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [])

  const header = useMemo(
    () => (
      <div className="row row-header">
        <div>ID</div>
        <div>Name</div>
        <div>Email</div>
        <div>City</div>
        <div>Salary</div>
        <div>Action</div>
      </div>
    ),
    []
  )

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
        <p className="muted">Custom virtualized list (only visible rows are rendered).</p>

        {isLoading && <div className="placeholder">Loading employees...</div>}
        {error && !isLoading && <div className="error">{error}</div>}

        {!isLoading && !error && (
          <div className="table">
            {header}
            <VirtualList
              items={rows}
              itemHeight={56}
              height={420}
              renderRow={(item) => (
                <div className="row">
                  <div>{item.id}</div>
                  <div>{item.name}</div>
                  <div>{item.email}</div>
                  <div>{item.city}</div>
                  <div>${item.salary.toLocaleString()}</div>
                  <div>
                    <Link to={`/details/${item.id}`}>Open</Link>
                  </div>
                </div>
              )}
            />
          </div>
        )}
      </section>
    </div>
  )
}

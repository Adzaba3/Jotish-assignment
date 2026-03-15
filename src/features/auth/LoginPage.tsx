import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const LoginPage: React.FC = () => {
  const { login, isAuthed } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthed) {
      navigate('/list', { replace: true })
    }
  }, [isAuthed, navigate])

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const ok = login(username.trim(), password)
    if (!ok) {
      setError('Invalid credentials. Use testuser / Test123.')
      return
    }
    navigate('/list', { replace: true })
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Sign in</h1>
        <p className="muted">Provided credentials: testuser / Test123</p>
        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="primary">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}

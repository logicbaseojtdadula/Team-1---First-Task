import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useLocation } from 'react-router-dom'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const location = useLocation()
  const successMessage = location.state?.message

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login({ email, password })
    
    if (!result.success) {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
              <path d="M25 5L45 15V35L25 45L5 35V15L25 5Z" fill="#1565C0" stroke="#1565C0" strokeWidth="2"/>
              <path d="M25 15L35 20V30L25 35L15 30V20L25 15Z" fill="white"/>
            </svg>
            <div>
              <h1>STRUCTASK</h1>
              <p>Structured Task Management</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Welcome to Structask</h2>
          
          {successMessage && <div className="success-message">{successMessage}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <div className="form-footer">
            <a href="#" className="link">Forgot Password?</a>
            <Link to="/signup" className="link">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

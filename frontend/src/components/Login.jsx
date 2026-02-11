import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

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
          <h1>📋 Task Manager</h1>
          <p>Team 1 - Project Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Sign In</h2>
          
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-info">
          <h3>Demo Accounts</h3>
          <div className="demo-accounts">
            <div className="demo-account">
              <strong>Customer</strong>
              <p>customer@project.com / customer123</p>
            </div>
            <div className="demo-account">
              <strong>Frontend Developer</strong>
              <p>frontend@project.com / frontend123</p>
            </div>
            <div className="demo-account">
              <strong>Backend Developer</strong>
              <p>backend@project.com / backend123</p>
            </div>
            <div className="demo-account">
              <strong>Server Admin</strong>
              <p>server@project.com / server123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

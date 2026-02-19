import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import './Signup.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://backend.test/api'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })

      // Auto-login after successful registration
      const loginResult = await login({
        email: formData.email,
        password: formData.password
      })

      if (loginResult.success) {
        // Redirect to dashboard
        navigate('/dashboard')
      } else {
        // If auto-login fails, redirect to login page
        navigate('/login', { state: { message: 'Registration successful! Please login.' } })
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
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

        <form onSubmit={handleSubmit} className="signup-form">
          <h2>Create Your Account</h2>
          
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="hidden"
              name="role"
              value="customer"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <button type="submit" className="btn-signup" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="form-footer">
            <span>Already have an account?</span>
            <a href="/" className="link">Login</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup

import { Link } from 'react-router-dom'
import './Welcome.css'

function Welcome() {
  return (
    <div className="welcome-page">
      <div className="welcome-container">
        {/* Header */}
        <header className="welcome-header">
          <div className="logo-section">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
              <path d="M25 5L45 15V35L25 45L5 35V15L25 5Z" fill="#1565C0" stroke="#1565C0" strokeWidth="2"/>
              <path d="M25 15L35 20V30L25 35L15 30V20L25 15Z" fill="white"/>
            </svg>
            <h1>STRUCTASK</h1>
          </div>
        </header>

        {/* Hero Section */}
        <main className="welcome-content">
          <div className="hero-section">
            <div className="hero-text">
              <h2 className="hero-title">
                Organize Your Work,<br />
                <span className="highlight">Empower Your Team</span>
              </h2>
              <p className="hero-subtitle">
                Streamline project management with intelligent task assignment, 
                real-time collaboration, and role-based workflows designed for modern teams.
              </p>
              <div className="hero-buttons">
                <Link to="/login" className="btn-primary-large">
                  Get Started
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                <Link to="/signup" className="btn-secondary-large">
                  Create Account
                </Link>
              </div>
            </div>

            <div className="hero-image">
              <div className="image-placeholder">
                <svg viewBox="0 0 400 300" fill="none">
                  {/* Illustration of task management */}
                  <rect x="50" y="50" width="300" height="200" rx="10" fill="#E3F2FD"/>
                  <rect x="70" y="70" width="120" height="15" rx="5" fill="#1565C0"/>
                  <rect x="70" y="95" width="180" height="10" rx="5" fill="#90CAF9"/>
                  <rect x="70" y="115" width="150" height="10" rx="5" fill="#90CAF9"/>
                  <rect x="70" y="145" width="120" height="15" rx="5" fill="#1565C0"/>
                  <rect x="70" y="170" width="200" height="10" rx="5" fill="#90CAF9"/>
                  <rect x="70" y="190" width="160" height="10" rx="5" fill="#90CAF9"/>
                  <circle cx="320" cy="80" r="15" fill="#4CAF50"/>
                  <path d="M315 80L318 83L325 76" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="320" cy="160" r="15" fill="#FFC107"/>
                  <circle cx="320" cy="200" r="15" fill="#2196F3"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <h3 className="features-title">Why Choose Structask?</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon feature-icon-blue">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h4>Smart Task Assignment</h4>
                <p>Automatically assign tasks to the right team members based on their roles and expertise.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon feature-icon-green">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <h4>Team Collaboration</h4>
                <p>Work together seamlessly with real-time updates and role-based access control.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon feature-icon-purple">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <h4>Project Tracking</h4>
                <p>Monitor progress, track deadlines, and manage multiple projects with ease.</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="welcome-footer">
          <p>&copy; 2026 Structask. MSU-IIT | MSU-NAAWAN | BUKSU</p>
        </footer>
      </div>
    </div>
  )
}

export default Welcome

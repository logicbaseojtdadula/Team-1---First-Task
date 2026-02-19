import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import './AdminDashboard.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [developers, setDevelopers] = useState({ frontend: [], backend: [], server: [] })
  const [showCreateDev, setShowCreateDev] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  
  const [newDev, setNewDev] = useState({
    name: '',
    email: '',
    password: '',
    role: 'frontend'
  })

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    customer_id: ''
  })

  const [assignment, setAssignment] = useState({
    frontend_id: '',
    backend_id: '',
    server_id: ''
  })

  useEffect(() => {
    loadDashboard()
    loadUsers()
    loadProjects()
  }, [])

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(res.data)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(res.data)
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadProjects = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/admin/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProjects(res.data)
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  const loadDevelopers = async (role) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/admin/developers/${role}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDevelopers(prev => ({ ...prev, [role]: res.data }))
    } catch (error) {
      console.error(`Error loading ${role} developers:`, error)
    }
  }

  const createDeveloper = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/admin/developers`, newDev, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Developer account created!')
      setNewDev({ name: '', email: '', password: '', role: 'frontend' })
      setShowCreateDev(false)
      loadUsers()
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating developer')
    }
  }

  const createProject = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/projects`, newProject, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Project created successfully!')
      setNewProject({ name: '', description: '', customer_id: '' })
      setShowCreateProject(false)
      loadProjects()
      loadDashboard()
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating project')
    }
  }

  const assignDevelopers = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/admin/projects/${selectedProject.id}/assign`, assignment, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Developers assigned successfully!')
      setShowAssignModal(false)
      setSelectedProject(null)
      setAssignment({ frontend_id: '', backend_id: '', server_id: '' })
      loadProjects()
    } catch (error) {
      alert(error.response?.data?.message || 'Error assigning developers')
    }
  }

  const openAssignModal = (project) => {
    setSelectedProject(project)
    setShowAssignModal(true)
    loadDevelopers('frontend')
    loadDevelopers('backend')
    loadDevelopers('server')
  }

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>🔧 ADMIN</h2>
        </div>
        <nav className="admin-nav">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            👥 Users
          </button>
          <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>
            📁 Projects
          </button>
          <button onClick={logout}>🚪 Logout</button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="admin-user">
            <span>{user.name}</span>
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.total_users || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Developers</h3>
                <p className="stat-number">{stats.total_developers || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Projects</h3>
                <p className="stat-number">{stats.total_projects || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Tasks</h3>
                <p className="stat-number">{stats.total_tasks || 0}</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <button className="btn-primary" onClick={() => setShowCreateDev(true)}>
                + Create Developer Account
              </button>

              {showCreateDev && (
                <div className="modal">
                  <div className="modal-content">
                    <h2>Create Developer Account</h2>
                    <form onSubmit={createDeveloper}>
                      <input
                        type="text"
                        placeholder="Name"
                        value={newDev.name}
                        onChange={(e) => setNewDev({...newDev, name: e.target.value})}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={newDev.email}
                        onChange={(e) => setNewDev({...newDev, email: e.target.value})}
                        required
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={newDev.password}
                        onChange={(e) => setNewDev({...newDev, password: e.target.value})}
                        required
                      />
                      <select value={newDev.role} onChange={(e) => setNewDev({...newDev, role: e.target.value})}>
                        <option value="frontend">Frontend Developer</option>
                        <option value="backend">Backend Developer</option>
                        <option value="server">Server Admin</option>
                      </select>
                      <div className="modal-actions">
                        <button type="submit" className="btn-primary">Create</button>
                        <button type="button" onClick={() => setShowCreateDev(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                      <td><span className={u.is_active ? 'status-active' : 'status-inactive'}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span></td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <button className="btn-primary" onClick={() => setShowCreateProject(true)}>
                + Create New Project
              </button>

              {showCreateProject && (
                <div className="modal">
                  <div className="modal-content">
                    <h2>Create New Project</h2>
                    <form onSubmit={createProject}>
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                        required
                      />
                      <textarea
                        placeholder="Project Description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        rows="3"
                      />
                      <label>Select Customer</label>
                      <select 
                        value={newProject.customer_id} 
                        onChange={(e) => setNewProject({...newProject, customer_id: e.target.value})}
                        required
                      >
                        <option value="">Select Customer</option>
                        {users.filter(u => u.role === 'customer').map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                        ))}
                      </select>
                      <div className="modal-actions">
                        <button type="submit" className="btn-primary">Create Project</button>
                        <button type="button" onClick={() => setShowCreateProject(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Developers</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.customer?.name}</td>
                      <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                      <td>{p.assignments?.length || 0} assigned</td>
                      <td>
                        <button className="btn-small" onClick={() => openAssignModal(p)}>
                          Assign Developers
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {showAssignModal && selectedProject && (
                <div className="modal">
                  <div className="modal-content">
                    <h2>Assign Developers to {selectedProject.name}</h2>
                    <form onSubmit={assignDevelopers}>
                      <label>Frontend Developer</label>
                      <select value={assignment.frontend_id} onChange={(e) => setAssignment({...assignment, frontend_id: e.target.value})} required>
                        <option value="">Select Frontend Developer</option>
                        {developers.frontend.map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                        ))}
                      </select>

                      <label>Backend Developer</label>
                      <select value={assignment.backend_id} onChange={(e) => setAssignment({...assignment, backend_id: e.target.value})} required>
                        <option value="">Select Backend Developer</option>
                        {developers.backend.map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                        ))}
                      </select>

                      <label>Server Admin</label>
                      <select value={assignment.server_id} onChange={(e) => setAssignment({...assignment, server_id: e.target.value})} required>
                        <option value="">Select Server Admin</option>
                        {developers.server.map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                        ))}
                      </select>

                      <div className="modal-actions">
                        <button type="submit" className="btn-primary">Assign</button>
                        <button type="button" onClick={() => setShowAssignModal(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard

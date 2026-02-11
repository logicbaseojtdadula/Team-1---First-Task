import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { projectAPI, taskAPI } from '../services/api'
import TaskForm from './TaskForm'
import './Dashboard.css'

function Dashboard() {
  const { user, logout } = useAuth()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [showTaskForm, setShowTaskForm] = useState(false)

  useEffect(() => {
    loadProjects()
    loadTasks()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await projectAPI.getAll()
      setProjects(response.data)
      if (response.data.length > 0) {
        setSelectedProject(response.data[0].id)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  const loadTasks = async () => {
    try {
      setLoading(true)
      const response = await taskAPI.getAll()
      setTasks(response.data)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks])
    setShowTaskForm(false)
  }

  const handleTaskUpdated = async (taskId, updates) => {
    try {
      const response = await taskAPI.update(taskId, updates)
      setTasks(tasks.map(task => task.id === taskId ? response.data : task))
    } catch (error) {
      alert('Error updating task: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleTaskDeleted = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      await taskAPI.delete(taskId)
      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (error) {
      alert('Error deleting task: ' + (error.response?.data?.message || error.message))
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter !== 'all' && task.status !== filter) return false
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return task.title.toLowerCase().includes(search) || 
             task.description?.toLowerCase().includes(search)
    }
    return true
  })

  const myTasks = filteredTasks.length
  const inProgress = filteredTasks.filter(t => t.status === 'in-progress').length
  const pendingReview = filteredTasks.filter(t => t.status === 'pending').length
  const completed = filteredTasks.filter(t => t.status === 'completed').length

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'status-badge status-todo',
      'in-progress': 'status-badge status-progress',
      'completed': 'status-badge status-completed'
    }
    const labels = {
      'pending': 'To Do',
      'in-progress': 'In Progress',
      'completed': 'Completed'
    }
    return <span className={badges[status]}>{labels[status]}</span>
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <svg width="35" height="35" viewBox="0 0 50 50" fill="none">
              <path d="M25 5L45 15V35L25 45L5 35V15L25 5Z" fill="white" stroke="white" strokeWidth="2"/>
              <path d="M25 15L35 20V30L25 35L15 30V20L25 15Z" fill="#1565C0"/>
            </svg>
            <span>STRUCTASK</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveMenu('dashboard')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </button>
          <button 
            className={`nav-item ${activeMenu === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveMenu('projects')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            Projects
          </button>
          <button 
            className={`nav-item ${activeMenu === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveMenu('profile')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            My Profile
          </button>
        </nav>

        <button className="logout-btn" onClick={logout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <h1 className="page-title">Dashboard</h1>
          <div className="top-bar-right">
            <button className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
            <div className="user-avatar">
              <img src={`https://ui-avatars.com/api/?name=${user.name}&background=1565C0&color=fff`} alt={user.name} />
            </div>
            <button className="btn-logout-top" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          <div className="welcome-section">
            <h2>Welcome, {user.name}!</h2>
            <p className="role-text">You are a {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-blue">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-label">My Tasks</div>
                <div className="stat-value">{myTasks}</div>
              </div>
            </div>

            <div className="stat-card stat-green">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-label">Task in Progress</div>
                <div className="stat-value">{inProgress}</div>
              </div>
            </div>

            <div className="stat-card stat-yellow">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-label">Tasks Pending Review</div>
                <div className="stat-value">{pendingReview}</div>
              </div>
            </div>

            <div className="stat-card stat-teal">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-label">Completed Tasks</div>
                <div className="stat-value">{completed}</div>
              </div>
            </div>
          </div>

          {/* Task Table */}
          <div className="task-section">
            <div className="section-header">
              <h3>My Assigned Tasks</h3>
              {user.role === 'customer' && (
                <button className="btn-primary" onClick={() => setShowTaskForm(!showTaskForm)}>
                  + New Task
                </button>
              )}
            </div>

            {showTaskForm && user.role === 'customer' && (
              <div className="task-form-modal">
                <TaskForm
                  projectId={selectedProject}
                  projects={projects}
                  onTaskCreated={handleTaskCreated}
                />
              </div>
            )}

            <div className="table-controls">
              <select 
                className="filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="task-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Project</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center">Loading...</td>
                    </tr>
                  ) : filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">No tasks found</td>
                    </tr>
                  ) : (
                    filteredTasks.map(task => (
                      <tr key={task.id}>
                        <td className="task-title">{task.title}</td>
                        <td className="task-project">{task.project?.name || 'N/A'}</td>
                        <td>
                          <span className="category-badge">{task.category}</span>
                        </td>
                        <td>{getStatusBadge(task.status)}</td>
                        <td className="task-date">
                          {new Date(task.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td>
                          <div className="action-buttons">
                            {user.role !== 'customer' && (
                              <select
                                value={task.status}
                                onChange={(e) => handleTaskUpdated(task.id, { status: e.target.value })}
                                className="status-select"
                              >
                                <option value="pending">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                            )}
                            {user.role === 'customer' && (
                              <button 
                                className="btn-delete"
                                onClick={() => handleTaskDeleted(task.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

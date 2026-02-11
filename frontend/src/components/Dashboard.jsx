import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { projectAPI, taskAPI } from '../services/api'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import './Dashboard.css'

function Dashboard() {
  const { user, logout } = useAuth()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

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
    // Filter by project
    if (selectedProject && task.project_id !== selectedProject) {
      return false
    }

    // Filter by status
    if (filter !== 'all' && task.status !== filter) {
      return false
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        task.title.toLowerCase().includes(search) ||
        task.description?.toLowerCase().includes(search)
      )
    }

    return true
  })

  const stats = {
    total: filteredTasks.length,
    pending: filteredTasks.filter(t => t.status === 'pending').length,
    inProgress: filteredTasks.filter(t => t.status === 'in-progress').length,
    completed: filteredTasks.filter(t => t.status === 'completed').length,
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>📋 Task Manager</h1>
              <p className="subtitle">Team 1 - Project Management System</p>
            </div>
            <div className="user-info">
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role.toUpperCase()}</span>
              </div>
              <button onClick={logout} className="btn-logout">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Project Selector */}
        {projects.length > 0 && (
          <div className="project-selector">
            <label>Select Project:</label>
            <select
              value={selectedProject || ''}
              onChange={(e) => setSelectedProject(Number(e.target.value))}
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card stat-progress">
            <div className="stat-number">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card stat-completed">
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="main-content">
          {/* Task Form (Customer Only) */}
          {user.role === 'customer' && (
            <div className="left-section">
              <TaskForm
                projectId={selectedProject}
                projects={projects}
                onTaskCreated={handleTaskCreated}
              />
            </div>
          )}

          {/* Task List */}
          <div className={user.role === 'customer' ? 'right-section' : 'full-section'}>
            {/* Filter Bar */}
            <div className="filter-bar">
              <input
                type="text"
                placeholder="🔍 Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </button>
                <button
                  className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
                  onClick={() => setFilter('in-progress')}
                >
                  In Progress
                </button>
                <button
                  className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading tasks...</div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                userRole={user.role}
                onUpdate={handleTaskUpdated}
                onDelete={handleTaskDeleted}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

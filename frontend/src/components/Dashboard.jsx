import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { projectAPI, taskAPI, authAPI } from '../services/api'
import TaskForm from './TaskForm'
import './Dashboard.css'
import './DashboardExtras.css'

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
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState(null)
  const [submissionType, setSubmissionType] = useState('link')
  const [submissionData, setSubmissionData] = useState({ file: null, link_url: '', description: '' })
  const [taskSubmissions, setTaskSubmissions] = useState({})
  const [realNotifications, setRealNotifications] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: '', message: '' })
  const [notifiedTaskIds, setNotifiedTaskIds] = useState(new Set())
  const [notifiedStatusChanges, setNotifiedStatusChanges] = useState(new Map())

  useEffect(() => {
    loadProjects()
    loadTasks()
  }, [user]) // Reload when user changes

  const loadTasksQuietly = async () => {
    try {
      const response = await taskAPI.getAll()
      const newTasks = response.data
      
      // Check if there are new tasks (only notify for tasks we haven't seen before)
      if (newTasks.length > tasks.length) {
        const newTasksAdded = newTasks.filter(task => !notifiedTaskIds.has(task.id))
        
        newTasksAdded.forEach(task => {
          // Only notify if we haven't notified about this task before
          if (!notifiedTaskIds.has(task.id)) {
            addNotification({
              type: 'task',
              message: `New task assigned: ${task.title}`,
              time: 'Just now',
              read: false,
              taskId: task.id
            })
            
            // Mark this task as notified
            setNotifiedTaskIds(prev => new Set([...prev, task.id]))
          }
        })
      }
      
      // Check for status updates (only notify once per status change)
      newTasks.forEach(newTask => {
        const oldTask = tasks.find(t => t.id === newTask.id)
        if (oldTask && oldTask.status !== newTask.status) {
          const changeKey = `${newTask.id}-${newTask.status}`
          
          // Only notify if we haven't notified about this specific status change
          if (!notifiedStatusChanges.has(changeKey)) {
            addNotification({
              type: 'update',
              message: `Task "${newTask.title}" status changed to ${newTask.status}`,
              time: 'Just now',
              read: false,
              taskId: newTask.id
            })
            
            // Mark this status change as notified
            setNotifiedStatusChanges(prev => new Map([...prev, [changeKey, true]]))
          }
        }
      })
      
      setTasks(newTasks)
    } catch (error) {
      console.error('Error polling tasks:', error)
    }
  }

  const addNotification = (notification) => {
    setRealNotifications(prev => [
      { ...notification, id: Date.now() },
      ...prev.slice(0, 19) // Keep only last 20 notifications
    ])
    
    // Only show browser notification, no toast
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Structask Update', {
        body: notification.message,
        icon: '/favicon.ico'
      })
    }
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  useEffect(() => {
    requestNotificationPermission()
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
      console.log('Loaded tasks for user:', user.email, '- Count:', response.data.length)
      console.log('Tasks:', response.data)
      setTasks(response.data)
      
      // Initialize notified task IDs with existing tasks (so we don't notify about old tasks)
      const existingTaskIds = new Set(response.data.map(task => task.id))
      setNotifiedTaskIds(existingTaskIds)
      
      // Initialize notified status changes
      const statusMap = new Map()
      response.data.forEach(task => {
        statusMap.set(`${task.id}-${task.status}`, true)
      })
      setNotifiedStatusChanges(statusMap)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks])
    setShowTaskForm(false)
    addNotification({
      type: 'task',
      message: `Task created: ${newTask.title}`,
      time: 'Just now',
      read: true
    })
  }

  const handleTaskUpdated = async (taskId, updates) => {
    try {
      const response = await taskAPI.update(taskId, updates)
      setTasks(tasks.map(task => task.id === taskId ? response.data : task))
      
      if (updates.status) {
        addNotification({
          type: 'update',
          message: `Task status updated to ${updates.status}`,
          time: 'Just now',
          read: true
        })
      }
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

  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
      const response = await projectAPI.create(newProject)
      setProjects([response.data, ...projects])
      setShowProjectForm(false)
      setNewProject({ name: '', description: '' })
      alert('Project created successfully! Developers have been automatically assigned.')
    } catch (error) {
      alert('Error creating project: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleOpenSubmissionModal = (task) => {
    setSelectedTaskForSubmission(task)
    setShowSubmissionModal(true)
    loadTaskSubmissions(task.id)
  }

  const loadTaskSubmissions = async (taskId) => {
    try {
      const response = await taskAPI.getSubmissions(taskId)
      setTaskSubmissions(prev => ({ ...prev, [taskId]: response.data }))
    } catch (error) {
      console.error('Error loading submissions:', error)
    }
  }

  const handleSubmitWork = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('type', submissionType)
      formData.append('description', submissionData.description)

      if (submissionType === 'link') {
        formData.append('link_url', submissionData.link_url)
      } else {
        if (!submissionData.file) {
          alert('Please select a file')
          return
        }
        formData.append('file', submissionData.file)
      }

      await taskAPI.addSubmission(selectedTaskForSubmission.id, formData)
      alert('Work submitted successfully!')
      setSubmissionData({ file: null, link_url: '', description: '' })
      loadTaskSubmissions(selectedTaskForSubmission.id)
    } catch (error) {
      alert('Error submitting work: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleDeleteSubmission = async (taskId, submissionId) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return
    try {
      await taskAPI.deleteSubmission(taskId, submissionId)
      loadTaskSubmissions(taskId)
    } catch (error) {
      alert('Error deleting submission: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('photo', file)

    try {
      const response = await authAPI.uploadProfilePhoto(formData)
      // Update user context with new photo
      const updatedUser = { ...user, profile_photo: response.data.profile_photo }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      window.location.reload() // Reload to show new photo
    } catch (error) {
      alert('Error uploading photo: ' + (error.response?.data?.message || error.message))
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

  console.log('Filter:', filter, 'Search:', searchTerm, 'Filtered tasks:', filteredTasks.length)

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
          <h1 className="page-title">
            {activeMenu === 'dashboard' && 'Dashboard'}
            {activeMenu === 'projects' && 'Projects'}
            {activeMenu === 'profile' && 'My Profile'}
          </h1>
          <div className="top-bar-right">
            <div className="notification-wrapper">
              <button 
                className="icon-btn notification-btn" 
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {realNotifications.filter(n => !n.read).length > 0 && (
                  <span className="notification-badge">{realNotifications.filter(n => !n.read).length}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h4>Notifications</h4>
                    <button className="mark-read-btn" onClick={() => setRealNotifications(realNotifications.map(n => ({ ...n, read: true })))}>
                      Mark all as read
                    </button>
                  </div>
                  <div className="notifications-list">
                    {realNotifications.length === 0 ? (
                      <div className="no-notifications">No notifications yet</div>
                    ) : (
                      realNotifications.map(notif => (
                        <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                          <div className="notification-icon">
                            {notif.type === 'task' && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                              </svg>
                            )}
                            {notif.type === 'update' && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            )}
                            {notif.type === 'comment' && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                              </svg>
                            )}
                          </div>
                          <div className="notification-content">
                            <p>{notif.message}</p>
                            <span className="notification-time">{notif.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="user-profile-wrapper">
              <button 
                className="user-avatar-btn" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=1565C0&color=fff`} alt={user.name} />
              </button>
              
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <img src={`https://ui-avatars.com/api/?name=${user.name}&background=1565C0&color=fff&size=64`} alt={user.name} />
                    <div className="profile-info">
                      <h4>{user.name}</h4>
                      <p className="profile-role">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                    </div>
                  </div>
                  <div className="profile-details">
                    <div className="profile-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span>{user.email}</span>
                    </div>
                    <div className="profile-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                    </div>
                    <div className="profile-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>Member since {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="profile-actions">
                    <button className="profile-action-btn" onClick={() => { setActiveMenu('profile'); setShowProfileMenu(false); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      View Profile
                    </button>
                    <button className="profile-action-btn profile-logout" onClick={logout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button className="btn-logout-top" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {/* Dashboard View */}
          {activeMenu === 'dashboard' && (
            <>
              <div className="welcome-section">
                <h2>Welcome, {user.name}!</h2>
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
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" onClick={loadTasks} style={{ background: '#9CA3AF' }}>
                  🔄 Refresh
                </button>
                {user.role === 'customer' && (
                  <>
                    <button className="btn-primary" onClick={() => setShowTaskForm(!showTaskForm)} style={{ background: '#3B82F6' }}>
                      + New Task
                    </button>
                    <button className="btn-primary" onClick={() => setShowProjectForm(!showProjectForm)} style={{ background: '#22D3EE' }}>
                      + New Project
                    </button>
                  </>
                )}
              </div>
            </div>

            {showProjectForm && user.role === 'customer' && (
              <div className="task-form-modal">
                <div className="task-form-card">
                  <div className="task-form-header">
                    <h3>Create New Project</h3>
                    <button className="close-btn" onClick={() => setShowProjectForm(false)}>×</button>
                  </div>
                  <form onSubmit={handleCreateProject}>
                    <div className="form-group">
                      <label>Project Name *</label>
                      <input
                        type="text"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        required
                        placeholder="Enter project name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        rows="4"
                        placeholder="Enter project description"
                      />
                    </div>
                    <div className="form-actions">
                      <button type="button" className="btn-secondary" onClick={() => setShowProjectForm(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Create Project
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showTaskForm && user.role === 'customer' && (
              <div className="task-form-modal">
                <TaskForm
                  projectId={selectedProject}
                  projects={projects}
                  onTaskCreated={handleTaskCreated}
                  onClose={() => setShowTaskForm(false)}
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
                    <th>Assigned To</th>
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
                          <span className="assignment-badge">
                            {task.category === 'frontend' && '🎨 Frontend'}
                            {task.category === 'backend' && '⚙️ Backend'}
                            {task.category === 'server' && '🖥️ Server'}
                          </span>
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
                          <div className="action-buttons" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {user.role !== 'customer' && (
                              <>
                                <select
                                  value={task.status}
                                  onChange={(e) => handleTaskUpdated(task.id, { status: e.target.value })}
                                  className="status-select"
                                >
                                  <option value="pending">To Do</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>
                                <button 
                                  className="btn-primary"
                                  onClick={() => handleOpenSubmissionModal(task)}
                                  style={{ fontSize: '12px', padding: '5px 10px', background: '#8B5CF6' }}
                                >
                                  📎 Submit Work
                                </button>
                                {task.status === 'completed' && (
                                  <button 
                                    className="btn-delete"
                                    onClick={() => handleTaskDeleted(task.id)}
                                    style={{ fontSize: '12px', padding: '5px 10px' }}
                                  >
                                    Delete
                                  </button>
                                )}
                              </>
                            )}
                            {user.role === 'customer' && (
                              <>
                                <button 
                                  className="btn-primary"
                                  onClick={() => handleOpenSubmissionModal(task)}
                                  style={{ fontSize: '12px', padding: '5px 10px', background: '#22D3EE' }}
                                >
                                  📎 View Submissions
                                </button>
                                <button 
                                  className="btn-delete"
                                  onClick={() => handleTaskDeleted(task.id)}
                                  style={{ fontSize: '12px', padding: '5px 10px' }}
                                >
                                  Delete
                                </button>
                              </>
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
            </>
          )}

          {/* Projects View */}
          {activeMenu === 'projects' && (
            <div className="projects-view">
              <div className="section-header">
                <h3>All Projects</h3>
              </div>
              <div className="projects-grid">
                {projects.length === 0 ? (
                  <p className="no-data">No projects available</p>
                ) : (
                  projects.map(project => (
                    <div key={project.id} className="project-card">
                      <h4>{project.name}</h4>
                      <p>{project.description}</p>
                      <div className="project-stats">
                        <span className="project-stat">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                          </svg>
                          {project.tasks?.length || 0} tasks
                        </span>
                        <span className="project-stat">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/>
                          </svg>
                          {project.assignments?.length || 0} members
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Profile View */}
          {activeMenu === 'profile' && (
            <div className="profile-view">
              <div className="profile-card-large">
                <div className="profile-banner"></div>
                <div className="profile-content-large">
                  <div className="profile-avatar-container">
                    <img 
                      src={user.profile_photo ? `http://backend.test/storage/${user.profile_photo}` : `https://ui-avatars.com/api/?name=${user.name}&background=1565C0&color=fff&size=128`} 
                      alt={user.name}
                      className="profile-avatar-large"
                    />
                    <label htmlFor="profile-photo-upload" className="upload-photo-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                      </svg>
                    </label>
                    <input 
                      id="profile-photo-upload" 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={handleProfilePhotoUpload}
                    />
                  </div>
                  <h2>{user.name}</h2>
                  <p className="profile-role-large">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                  
                  <div className="profile-info-grid">
                    <div className="profile-info-item">
                      <label>Email</label>
                      <p>{user.email}</p>
                    </div>
                    <div className="profile-info-item">
                      <label>Role</label>
                      <p>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                    </div>
                    <div className="profile-info-item">
                      <label>User ID</label>
                      <p>#{user.id}</p>
                    </div>
                    <div className="profile-info-item">
                      <label>Member Since</label>
                      <p>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="profile-stats-section">
                    <h3>Your Statistics</h3>
                    <div className="profile-stats-grid">
                      <div className="profile-stat-card">
                        <div className="stat-number">{myTasks}</div>
                        <div className="stat-label">Total Tasks</div>
                      </div>
                      <div className="profile-stat-card">
                        <div className="stat-number">{completed}</div>
                        <div className="stat-label">Completed</div>
                      </div>
                      <div className="profile-stat-card">
                        <div className="stat-number">{inProgress}</div>
                        <div className="stat-label">In Progress</div>
                      </div>
                      <div className="profile-stat-card">
                        <div className="stat-number">{pendingReview}</div>
                        <div className="stat-label">Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Submission Modal */}
      {showSubmissionModal && selectedTaskForSubmission && (
        <div className="task-form-modal" onClick={() => setShowSubmissionModal(false)}>
          <div className="task-form-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="task-form-header">
              <h3>📎 Work Submissions - {selectedTaskForSubmission.title}</h3>
              <button className="close-btn" onClick={() => setShowSubmissionModal(false)}>×</button>
            </div>

            {user.role !== 'customer' && (
              <form onSubmit={handleSubmitWork} style={{ marginBottom: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '20px' }}>
                <div className="form-group">
                  <label>Submission Type</label>
                  <select 
                    value={submissionType} 
                    onChange={(e) => setSubmissionType(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="link">Link/URL</option>
                    <option value="image">Image</option>
                    <option value="file">File</option>
                  </select>
                </div>

                {submissionType === 'link' ? (
                  <div className="form-group">
                    <label>URL *</label>
                    <input
                      type="url"
                      value={submissionData.link_url}
                      onChange={(e) => setSubmissionData({ ...submissionData, link_url: e.target.value })}
                      required
                      placeholder="https://example.com"
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>{submissionType === 'image' ? 'Image' : 'File'} *</label>
                    <input
                      type="file"
                      accept={submissionType === 'image' ? 'image/*' : '*'}
                      onChange={(e) => setSubmissionData({ ...submissionData, file: e.target.files[0] })}
                      required
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Description (Optional)</label>
                  <textarea
                    value={submissionData.description}
                    onChange={(e) => setSubmissionData({ ...submissionData, description: e.target.value })}
                    rows="3"
                    placeholder="Add notes about your submission..."
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  Submit Work
                </button>
              </form>
            )}

            <div>
              <h4 style={{ marginBottom: '15px', color: '#333' }}>Previous Submissions</h4>
              {!taskSubmissions[selectedTaskForSubmission.id] || taskSubmissions[selectedTaskForSubmission.id].length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No submissions yet</p>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {taskSubmissions[selectedTaskForSubmission.id].map(submission => (
                    <div key={submission.id} style={{ 
                      padding: '15px', 
                      marginBottom: '10px', 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '8px',
                      background: '#f9f9f9'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <span style={{ 
                              background: submission.type === 'link' ? '#2196F3' : submission.type === 'image' ? '#4CAF50' : '#FF9800',
                              color: 'white',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              {submission.type.toUpperCase()}
                            </span>
                            <span style={{ fontSize: '12px', color: '#666' }}>
                              by {submission.user.name} • {new Date(submission.created_at).toLocaleString()}
                            </span>
                          </div>

                          {submission.type === 'link' && (
                            <a 
                              href={submission.link_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ color: '#1565C0', textDecoration: 'none', wordBreak: 'break-all' }}
                            >
                              🔗 {submission.link_url}
                            </a>
                          )}

                          {submission.type === 'image' && (
                            <div>
                              <img 
                                src={`http://backend.test/storage/${submission.file_path}`} 
                                alt={submission.file_name}
                                style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '4px', marginTop: '8px' }}
                              />
                              <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>📷 {submission.file_name}</p>
                            </div>
                          )}

                          {submission.type === 'file' && (
                            <a 
                              href={`http://backend.test/storage/${submission.file_path}`}
                              download={submission.file_name}
                              style={{ color: '#1565C0', textDecoration: 'none' }}
                            >
                              📄 {submission.file_name}
                            </a>
                          )}

                          {submission.description && (
                            <p style={{ marginTop: '8px', color: '#555', fontSize: '14px' }}>
                              {submission.description}
                            </p>
                          )}
                        </div>

                        {submission.user_id === user.id && (
                          <button 
                            onClick={() => handleDeleteSubmission(selectedTaskForSubmission.id, submission.id)}
                            style={{ 
                              background: '#f44336', 
                              color: 'white', 
                              border: 'none', 
                              padding: '5px 10px', 
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <div className="toast-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="toast-content">
            <h4>{toastMessage.title}</h4>
            <p>{toastMessage.message}</p>
          </div>
          <button className="toast-close" onClick={() => setShowToast(false)}>×</button>
        </div>
      )}
    </div>
  )
}

export default Dashboard

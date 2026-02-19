import { useState } from 'react'
import { taskAPI } from '../services/api'
import './TaskForm.css'

function TaskForm({ projectId, projects, onTaskCreated, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('frontend')
  const [priority, setPriority] = useState('medium')
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!selectedProjectId) {
      setError('Please select a project')
      return
    }

    if (!title.trim()) {
      setError('Please enter a task title')
      return
    }

    setLoading(true)

    try {
      const response = await taskAPI.create({
        project_id: selectedProjectId,
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
      })

      onTaskCreated(response.data)
      
      // Reset form
      setTitle('')
      setDescription('')
      setCategory('frontend')
      setPriority('medium')
      
      alert('Task created successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="task-form-card">
      <div className="task-form-header">
        <h2>➕ Create New Task</h2>
        {onClose && (
          <button className="close-btn" onClick={onClose} type="button">
            ×
          </button>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label>Project *</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            required
            disabled={loading}
          >
            <option value="">Select a project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Task Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description..."
            rows="4"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Assign To *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={loading}
          >
            <option value="frontend">🎨 Frontend Developer</option>
            <option value="backend">⚙️ Backend Developer</option>
            <option value="server">🖥️ Server Admin</option>
          </select>
          <small className="form-help">
            Task will be automatically assigned to the appropriate developer
          </small>
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={loading}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  )
}

export default TaskForm

import { useState } from 'react'
import './TaskItem.css'

function TaskItem({ task, userRole, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || '')
  const [editCategory, setEditCategory] = useState(task.category)
  const [editPriority, setEditPriority] = useState(task.priority)

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      alert('Task title cannot be empty')
      return
    }

    onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      category: editCategory,
      priority: editPriority,
    })

    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setEditCategory(task.category)
    setEditPriority(task.priority)
    setIsEditing(false)
  }

  const handleStatusChange = (newStatus) => {
    onUpdate(task.id, { status: newStatus })
  }

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'frontend': return '🎨'
      case 'backend': return '⚙️'
      case 'server': return '🖥️'
      default: return '📋'
    }
  }

  const getCategoryLabel = (category) => {
    switch(category) {
      case 'frontend': return 'Frontend'
      case 'backend': return 'Backend'
      case 'server': return 'Server'
      default: return 'General'
    }
  }

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      'pending': { text: 'Pending', class: 'status-pending' },
      'in-progress': { text: 'In Progress', class: 'status-progress' },
      'completed': { text: 'Completed', class: 'status-completed' }
    }
    return badges[status] || badges.pending
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isEditing) {
    return (
      <div className="task-item task-editing">
        <div className="task-edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-input"
            placeholder="Task title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="edit-textarea"
            placeholder="Task description"
            rows="3"
          />
          <div className="edit-row">
            <div className="edit-field">
              <label>Category:</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="edit-select"
              >
                <option value="frontend">🎨 Frontend</option>
                <option value="backend">⚙️ Backend</option>
                <option value="server">🖥️ Server</option>
              </select>
            </div>
            <div className="edit-field">
              <label>Priority:</label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="edit-select"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>
          <div className="edit-actions">
            <button onClick={handleSaveEdit} className="btn-save">
              Save
            </button>
            <button onClick={handleCancelEdit} className="btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statusBadge = getStatusBadge(task.status)

  return (
    <div className={`task-item task-${task.status}`}>
      <div className="task-header">
        <div className="task-priority">
          {getPriorityIcon(task.priority)}
        </div>
        <div className="task-title-section">
          <h3 className="task-title">{task.title}</h3>
          <span className={`status-badge ${statusBadge.class}`}>
            {statusBadge.text}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className="task-project">
          📁 <strong>{task.project?.name || 'Unknown Project'}</strong>
        </span>
        <span className="task-category">
          {getCategoryIcon(task.category)} <strong>{getCategoryLabel(task.category)}</strong>
        </span>
        <span className="task-priority-text">
          Priority: <strong>{task.priority}</strong>
        </span>
        <span className="task-date">📅 {formatDate(task.created_at)}</span>
      </div>

      <div className="task-actions">
        <div className="status-buttons">
          <button
            onClick={() => handleStatusChange('pending')}
            className={`status-btn ${task.status === 'pending' ? 'active' : ''}`}
            title="Mark as Pending"
          >
            ⏸️
          </button>
          <button
            onClick={() => handleStatusChange('in-progress')}
            className={`status-btn ${task.status === 'in-progress' ? 'active' : ''}`}
            title="Mark as In Progress"
          >
            ▶️
          </button>
          <button
            onClick={() => handleStatusChange('completed')}
            className={`status-btn ${task.status === 'completed' ? 'active' : ''}`}
            title="Mark as Completed"
          >
            ✅
          </button>
        </div>

        {userRole === 'customer' && (
          <div className="action-buttons">
            <button
              onClick={() => setIsEditing(true)}
              className="btn-edit"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="btn-delete"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskItem

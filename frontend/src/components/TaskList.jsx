import TaskItem from './TaskItem'
import './TaskList.css'

function TaskList({ tasks, userRole, onUpdate, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>No tasks found</h3>
        <p>
          {userRole === 'customer'
            ? 'Create a new task to get started'
            : 'No tasks assigned to you yet'}
        </p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          userRole={userRole}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default TaskList

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Edit, Trash2, ArrowRight, Clock } from 'lucide-react';

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'High';
      case 'MEDIUM':
        return 'Medium';
      case 'LOW':
        return 'Low';
      default:
        return priority;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'TODO':
        return 'To Do';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <div className="task-card">
      <div>
        <div className="task-card-header">
          <div className="task-card-tags">
            <span className={`badge badge-priority-${task.priority}`}>
              {getPriorityLabel(task.priority)}
            </span>
            <span className={`badge badge-status-${task.status}`}>
              {getStatusLabel(task.status)}
            </span>
          </div>

          <div className="task-card-actions">
            <Link
              to={`/tasks/${task.id}/edit`}
              className="btn-icon"
              title="Edit Task"
              style={{ padding: '6px' }}
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={() => onDelete(task)}
              className="btn-icon"
              title="Delete Task"
              style={{ padding: '6px', color: 'var(--danger-500)' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <Link to={`/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="task-card-title" title={task.title}>
            {task.title}
          </h3>
        </Link>

        {task.description && (
          <p className="task-card-desc">{task.description}</p>
        )}
      </div>

      <div>
        {onStatusChange && (
          <div style={{ marginBottom: '0.85rem' }}>
            <select
              className="form-select"
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              style={{
                fontSize: '0.825rem',
                padding: '0.35rem 0.65rem',
                backgroundColor: 'var(--bg-subtle)',
              }}
            >
              <option value="TODO">Mark as To Do</option>
              <option value="IN_PROGRESS">Mark as In Progress</option>
              <option value="COMPLETED">Mark as Completed</option>
            </select>
          </div>
        )}

        <div className="task-card-footer">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={13} />
            {formatDate(task.createdAt)}
          </span>

          <Link
            to={`/tasks/${task.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 600,
              fontSize: '0.8rem',
            }}
          >
            Details <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  ArrowLeft,
  User,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { taskService } from '../services/taskService';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import ConfirmModal from '../components/ConfirmModal';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await taskService.getTaskById(id);
        setTask(data);
      } catch (err) {
        setError(err.message || 'Failed to retrieve task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (!task) return;
    try {
      const updated = await taskService.updateTask(task.id, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: newStatus,
      });
      setTask(updated);
    } catch (err) {
      setError('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await taskService.deleteTask(id);
      navigate('/tasks');
    } catch (err) {
      setError('Failed to delete task: ' + err.message);
      setIsDeleteModalOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (loading) {
    return <LoadingSpinner message="Fetching task details..." />;
  }

  if (error && !task) {
    return (
      <div>
        <ErrorAlert message={error} />
        <Button
          variant="secondary"
          onClick={() => navigate('/tasks')}
          icon={<ArrowLeft size={16} />}
        >
          Back to Tasks
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/tasks')}
            icon={<ArrowLeft size={16} />}
          >
            All Tasks
          </Button>
          <span style={{ color: 'var(--text-muted)' }}>/ Task #{task.id}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to={`/tasks/${task.id}/edit`}>
            <Button variant="secondary" icon={<Edit size={16} />}>
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            onClick={() => setIsDeleteModalOpen(true)}
            icon={<Trash2 size={16} />}
          >
            Delete
          </Button>
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      <div className="task-details-card">
        {/* Badges & ID */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className={`badge badge-priority-${task.priority}`}>
              Priority: {task.priority}
            </span>
            <span className={`badge badge-status-${task.status}`}>
              Status: {task.status.replace('_', ' ')}
            </span>
          </div>

          {/* Quick status change */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Change Status:
            </label>
            <select
              className="form-select"
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{
                width: 'auto',
                fontSize: '0.825rem',
                padding: '0.35rem 0.75rem',
                backgroundColor: 'var(--bg-subtle)',
              }}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '1.75rem',
            lineHeight: 1.3,
            marginBottom: '1.25rem',
            color: 'var(--text-primary)',
          }}
        >
          {task.title}
        </h1>

        {/* Metadata Grid */}
        <div className="task-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Task ID</span>
            <span className="meta-value">#{task.id}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Created At</span>
            <span className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} style={{ color: 'var(--primary-600)' }} />
              {formatDate(task.createdAt)}
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Last Updated</span>
            <span className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} style={{ color: 'var(--primary-600)' }} />
              {formatDate(task.updatedAt)}
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Owner</span>
            <span className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={14} style={{ color: 'var(--primary-600)' }} />
              {task.userName || 'Account Owner'}
            </span>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginTop: '1.5rem' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Description
          </h3>
          {task.description ? (
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.975rem',
                lineHeight: 1.6,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {task.description}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No description provided for this task.
            </p>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Task"
        message={`Are you sure you want to delete task #${task.id}: "${task.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default TaskDetails;

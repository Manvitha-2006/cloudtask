import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError('');
        const task = await taskService.getTaskById(id);
        setInitialData({
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          status: task.status,
        });
      } catch (err) {
        setError(err.message || 'Failed to load task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError('');
      await taskService.updateTask(id, formData);
      navigate(`/tasks/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading task for editing..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Task</h1>
          <p className="page-subtitle">Update task information and progression status.</p>
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {initialData && (
        <div
          style={{
            background: 'var(--bg-surface)',
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <TaskForm
            initialValues={initialData}
            onSubmit={handleSubmit}
            loading={saving}
            submitText="Update Task"
            isEdit
          />
        </div>
      )}
    </div>
  );
};

export default EditTask;

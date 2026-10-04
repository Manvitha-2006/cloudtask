import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import TaskForm from '../components/TaskForm';
import ErrorAlert from '../components/ErrorAlert';

const AddTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      await taskService.createTask(formData);
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Task</h1>
          <p className="page-subtitle">
            Define a new action item, milestone, or deployment step.
          </p>
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

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
          onSubmit={handleSubmit}
          loading={loading}
          submitText="Create Task"
        />
      </div>
    </div>
  );
};

export default AddTask;

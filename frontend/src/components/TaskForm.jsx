import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

const DEFAULT_INITIAL_VALUES = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  status: 'TODO',
};

const TaskForm = ({
  initialValues = DEFAULT_INITIAL_VALUES,
  onSubmit,
  loading = false,
  submitText = 'Save Task',
  isEdit = false,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: '680px', width: '100%' }}
    >
      {/* Task Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Task Title <span className="required">*</span>
        </label>

        <input
          id="title"
          name="title"
          type="text"
          placeholder="e.g. Set up AWS CodeDeploy blue-green target groups"
          className={`form-input ${errors.title ? 'has-error' : ''}`}
          value={formData.title}
          onChange={handleChange}
          disabled={loading}
          autoFocus
        />

        {errors.title && (
          <span className="form-error">
            {errors.title}
          </span>
        )}
      </div>

      {/* Task Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={5}
          placeholder="Provide detailed information or steps for completing this task..."
          className="form-textarea"
          value={formData.description || ''}
          onChange={handleChange}
          disabled={loading}
        />

        <span className="form-hint">
          Markdown or plain text descriptions are supported.
        </span>
      </div>

      {/* Priority & Status */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div className="form-group">
          <label className="form-label" htmlFor="priority">
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            className="form-select"
            value={formData.priority}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="status">
            Status
          </label>

          <select
            id="status"
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '1.5rem',
        }}
      >
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon={<CheckCircle2 size={18} />}
        >
          {submitText}
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={loading}
          onClick={() => navigate(-1)}
          icon={<ArrowLeft size={16} />}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
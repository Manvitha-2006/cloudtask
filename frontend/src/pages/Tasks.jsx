import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Plus, ListTodo, Filter, X } from 'lucide-react';
import { taskService } from '../services/taskService';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import ConfirmModal from '../components/ConfirmModal';

const Tasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state initialized from searchParams if present
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [priority, setPriority] = useState(searchParams.get('priority') || '');

  // Delete modal state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    const urlStatus = searchParams.get('status') || '';
    const urlPriority = searchParams.get('priority') || '';
    const urlSearch = searchParams.get('search') || '';

    setStatus(urlStatus);
    setPriority(urlPriority);
    setSearch(urlSearch);
  }, [searchParams]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await taskService.getTasks({
        status: status || undefined,
        priority: priority || undefined,
        search: search || undefined,
      });
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [status, priority, search]);

  const updateFilters = (newStatus, newPriority, newSearch) => {
    const params = {};
    if (newStatus) params.status = newStatus;
    if (newPriority) params.priority = newPriority;
    if (newSearch) params.search = newSearch;
    setSearchParams(params);
  };

  const handleStatusFilterChange = (val) => {
    setStatus(val);
    updateFilters(val, priority, search);
  };

  const handlePriorityFilterChange = (val) => {
    setPriority(val);
    updateFilters(status, val, search);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    updateFilters(status, priority, val);
  };

  const handleClearFilters = () => {
    setStatus('');
    setPriority('');
    setSearch('');
    setSearchParams({});
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      await taskService.updateTask(taskId, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: newStatus,
      });

      // Update locally for snappy UI response
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      setError('Failed to update task status: ' + err.message);
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setDeleteLoading(true);
      await taskService.deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    } catch (err) {
      setError('Failed to delete task: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const hasActiveFilters = Boolean(status || priority || search);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks Management</h1>
          <p className="page-subtitle">
            View, search, filter, and organize all your project tasks.
          </p>
        </div>

        <Link to="/tasks/new">
          <Button icon={<Plus size={18} />}>Create Task</Button>
        </Link>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {/* Filter and Search Bar */}
      <div className="filters-toolbar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-selects">
          <select
            className="form-select"
            value={status}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            className="form-select"
            value={priority}
            onChange={(e) => handlePriorityFilterChange(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="sm"
              icon={<X size={14} />}
              onClick={handleClearFilters}
              title="Clear all filters"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Task Content */}
      {loading ? (
        <LoadingSpinner message="Fetching tasks..." />
      ) : tasks.length > 0 ? (
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={(t) => setTaskToDelete(t)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ListTodo size={32} />
          </div>
          <h3 className="empty-state-title">
            {hasActiveFilters ? 'No matching tasks' : 'No tasks created yet'}
          </h3>
          <p className="empty-state-text">
            {hasActiveFilters
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'Start by creating your first task to track work in your AWS CI/CD pipeline!'}
          </p>
          {hasActiveFilters ? (
            <Button variant="secondary" onClick={handleClearFilters}>
              Reset Filters
            </Button>
          ) : (
            <Link to="/tasks/new">
              <Button icon={<Plus size={18} />}>Add New Task</Button>
            </Link>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={confirmDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};

export default Tasks;

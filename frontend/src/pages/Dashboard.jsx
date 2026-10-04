import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import DashboardCard from '../components/DashboardCard';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import ConfirmModal from '../components/ConfirmModal';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    highPriorityTasks: 0,
    recentTasks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await taskService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = stats.recentTasks.find((t) => t.id === taskId);
      if (!task) return;

      await taskService.updateTask(taskId, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: newStatus,
      });

      // Refresh dashboard data
      fetchDashboardData();
    } catch (err) {
      setError('Failed to update task status: ' + err.message);
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setDeleteLoading(true);
      await taskService.deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to delete task: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && !stats.recentTasks?.length) {
    return <LoadingSpinner message="Loading dashboard overview..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name}! 👋</h1>
          <p className="page-subtitle">
            Here's what is happening with your cloud tasks today.
          </p>
        </div>

        <Link to="/tasks/new">
          <Button icon={<Plus size={18} />}>Add New Task</Button>
        </Link>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {/* Metrics Row: 5 Cards */}
      <div className="dashboard-grid">
        <DashboardCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={<Layers size={24} />}
          accentColor="#4f46e5"
          iconBg="#eef2ff"
          iconColor="#4f46e5"
          onClick={() => navigate('/tasks')}
        />

        <DashboardCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={<ListTodo size={24} />}
          accentColor="#0284c7"
          iconBg="#e0f2fe"
          iconColor="#0284c7"
          onClick={() => navigate('/tasks?status=TODO')}
        />

        <DashboardCard
          title="In Progress"
          value={stats.inProgressTasks}
          icon={<Clock size={24} />}
          accentColor="#d97706"
          iconBg="#fef3c7"
          iconColor="#d97706"
          onClick={() => navigate('/tasks?status=IN_PROGRESS')}
        />

        <DashboardCard
          title="Completed"
          value={stats.completedTasks}
          icon={<CheckCircle2 size={24} />}
          accentColor="#16a34a"
          iconBg="#dcfce7"
          iconColor="#16a34a"
          onClick={() => navigate('/tasks?status=COMPLETED')}
        />

        <DashboardCard
          title="High Priority"
          value={stats.highPriorityTasks}
          icon={<AlertTriangle size={24} />}
          accentColor="#dc2626"
          iconBg="#fee2e2"
          iconColor="#dc2626"
          onClick={() => navigate('/tasks?priority=HIGH')}
        />
      </div>

      {/* Recent Tasks Section */}
      <div style={{ marginTop: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Recent Tasks</h2>
          {stats.recentTasks && stats.recentTasks.length > 0 && (
            <Link
              to="/tasks"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              View all tasks <ArrowRight size={15} />
            </Link>
          )}
        </div>

        {stats.recentTasks && stats.recentTasks.length > 0 ? (
          <div className="task-grid">
            {stats.recentTasks.map((task) => (
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
            <h3 className="empty-state-title">No tasks found</h3>
            <p className="empty-state-text">
              You haven't created any tasks yet. Get started by adding your first project task!
            </p>
            <Link to="/tasks/new">
              <Button icon={<Plus size={18} />}>Create Your First Task</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Confirmation Modal for deletion */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${taskToDelete?.title}"? This action cannot be undone.`}
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

export default Dashboard;

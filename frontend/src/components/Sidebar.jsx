import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  User,
  LogOut,
  Cloud,
  Layers,
  GitBranch
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'All Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Add Task', path: '/tasks/new', icon: PlusCircle },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Cloud size={22} />
          </div>
          <span className="sidebar-brand-name">CloudTask</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-cicd-card">
            <div className="sidebar-cicd-title" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <GitBranch size={13} />
              <span>CI/CD Pipeline</span>
            </div>
            <p className="sidebar-cicd-desc">
              AWS CodePipeline with Blue-Green Zero Downtime Deployment.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="nav-link-item"
            style={{ width: '100%', color: 'var(--danger-500)' }}
          >
            <LogOut size={19} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

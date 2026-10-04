import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus, Cloud, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="btn-icon"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
          style={{ display: 'flex' }}
        >
          <Menu size={22} />
        </button>

        <div className="navbar-project-tag">
          <ShieldCheck size={16} style={{ color: 'var(--primary-600)' }} />
          <span>AWS Blue-Green Pipeline</span>
        </div>
      </div>

      <div className="navbar-right">
        <Link to="/tasks/new">
          <Button size="sm" icon={<Plus size={16} />}>
            New Task
          </Button>
        </Link>

        <Link to="/profile" className="user-badge" title="View Profile">
          <div className="user-avatar">{userInitial}</div>
          <span className="user-name-text">{user?.name || 'User'}</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

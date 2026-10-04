import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  CheckCircle,
  LogOut,
  ShieldCheck,
  Server,
  GitBranch,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import ErrorAlert from '../components/ErrorAlert';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, refreshProfile } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await refreshProfile();
        setProfileData(data);
      } catch (err) {
        setError('Failed to fetch profile details: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Active Member';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">Manage your account information and view project details.</p>
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* User Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-large">{userInitial}</div>

          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            {profileData?.name || user?.name}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {profileData?.email || user?.email}
          </p>

          <div>
            <div className="profile-info-row">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <User size={16} /> User ID
              </span>
              <span style={{ fontWeight: 600 }}>#{profileData?.id || user?.id}</span>
            </div>

            <div className="profile-info-row">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Mail size={16} /> Email
              </span>
              <span style={{ fontWeight: 600 }}>{profileData?.email || user?.email}</span>
            </div>

            <div className="profile-info-row">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <CheckCircle size={16} /> Total Tasks Created
              </span>
              <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                {profileData?.totalTasks ?? user?.totalTasks ?? 0}
              </span>
            </div>

            <div className="profile-info-row">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Calendar size={16} /> Joined
              </span>
              <span style={{ fontWeight: 600 }}>
                {formatDate(profileData?.createdAt || user?.createdAt)}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Button
              variant="danger"
              onClick={() => setIsLogoutModalOpen(true)}
              icon={<LogOut size={16} />}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Project & Deployment Architecture Card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ShieldCheck size={24} style={{ color: 'var(--primary-600)' }} />
            <h2 style={{ fontSize: '1.35rem' }}>Project Architecture</h2>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            <strong>AWS CI/CD Pipeline using CodePipeline with Blue-Green Deployment</strong>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: '0.75rem',
              }}
            >
              <GitBranch size={20} style={{ color: 'var(--primary-600)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  AWS CodePipeline & CodeBuild
                </strong>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Automates compilation, unit testing, and packaging of Spring Boot and Vite React artifacts upon git push.
                </p>
              </div>
            </div>

            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: '0.75rem',
              }}
            >
              <Server size={20} style={{ color: '#0284c7', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  AWS CodeDeploy (Blue-Green)
                </strong>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Deploys new revision to the Green fleet, validates health checks at <code>/api/health</code>, and shifts traffic from Blue to Green with zero downtime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Confirm Sign Out"
        message="Are you sure you want to sign out of CloudTask?"
        confirmText="Sign Out"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default Profile;

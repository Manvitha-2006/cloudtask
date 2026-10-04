import React from 'react';

const DashboardCard = ({
  title,
  value,
  icon,
  accentColor = '#4f46e5',
  iconBg = '#eef2ff',
  iconColor = '#4f46e5',
  onClick,
}) => {
  return (
    <div
      className="dashboard-card"
      style={{
        '--card-accent': accentColor,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <div className="dashboard-card-info">
        <span className="dashboard-card-title">{title}</span>
        <span className="dashboard-card-value">{value ?? 0}</span>
      </div>

      <div
        className="dashboard-card-icon"
        style={{
          backgroundColor: iconBg,
          color: iconColor,
        }}
      >
        {icon}
      </div>
    </div>
  );
};

export default DashboardCard;

import React from 'react';

const StatCard = ({ icon: Icon, label, value, subtext, accentColor = 'indigo' }) => {
  const colorMap = {
    indigo: {
      border: 'rgba(99, 102, 241, 0.3)',
      bg: 'rgba(99, 102, 241, 0.12)',
      text: '#818cf8'
    },
    amber: {
      border: 'rgba(245, 158, 11, 0.3)',
      bg: 'rgba(245, 158, 11, 0.12)',
      text: '#fbbf24'
    },
    emerald: {
      border: 'rgba(16, 185, 129, 0.3)',
      bg: 'rgba(16, 185, 129, 0.12)',
      text: '#34d399'
    },
    cyan: {
      border: 'rgba(6, 182, 212, 0.3)',
      bg: 'rgba(6, 182, 212, 0.12)',
      text: '#38bdf8'
    },
    purple: {
      border: 'rgba(168, 85, 247, 0.3)',
      bg: 'rgba(168, 85, 247, 0.12)',
      text: '#c084fc'
    }
  };

  const theme = colorMap[accentColor] || colorMap.indigo;

  return (
    <div 
      className="card card-hover" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.25rem',
        borderLeft: `4px solid ${theme.text}`
      }}
    >
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 'var(--radius-md)',
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.text,
        flexShrink: 0
      }}>
        {Icon && <Icon size={26} />}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {label}
        </span>
        <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {value}
        </span>
        {subtext && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 2 }}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;

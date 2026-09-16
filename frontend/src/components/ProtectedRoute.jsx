import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card glass-card" style={{ maxWidth: 500, margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <ShieldAlert size={36} />
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>Administrator Access Required</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
            You are logged in as <strong>{currentUser?.name}</strong> (Student role). 
            Access to this administrative section is restricted to faculty and platform administrators.
          </p>
          <a href="/dashboard" className="btn btn-primary">
            Return to Student Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

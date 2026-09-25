import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children, requireAdmin = false, requireTeacher = false }) => {
  const { currentUser, isAuthenticated, isAdmin, isTeacher, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-indigo)', fontWeight: 600 }}>
          Verifying authentication session...
        </div>
      </div>
    );
  }

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
            You are logged in as <strong>{currentUser?.name}</strong> ({currentUser?.role} role). 
            Access to this section is restricted to platform administrators.
          </p>
          <a href="/dashboard" className="btn btn-primary">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (requireTeacher && !isTeacher) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card glass-card" style={{ maxWidth: 500, margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <ShieldAlert size={36} />
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>Teacher Access Required</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
            You are logged in as <strong>{currentUser?.name}</strong> ({currentUser?.role} role). 
            Access to the Teacher Portal is restricted to verified educators and administrators.
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

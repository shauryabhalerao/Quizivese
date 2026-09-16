import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
      <div className="card glass-card" style={{ maxWidth: 520, margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.15)',
          color: '#818cf8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Compass size={36} />
        </div>

        <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>404 Lost in Orbit</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          The cosmic coordinates you followed don't seem to exist. Let's guide you safely back to familiar space.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary">
            <Home size={16} /> Home
          </Link>
          <Link to="/quizzes" className="btn btn-primary">
            <Sparkles size={16} /> Explore Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

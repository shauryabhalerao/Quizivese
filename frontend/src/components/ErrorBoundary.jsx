import React from 'react';
import { AlertCircle, RefreshCw, Home, Trash2 } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Quiziverse ErrorBoundary caught an error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleResetStorage = () => {
    try {
      localStorage.removeItem('quiziverse_user');
      localStorage.removeItem('quiziverse_token');
      sessionStorage.clear();
      window.location.href = '/';
    } catch (e) {
      window.location.reload();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'var(--bg-dark, #0b0f19)',
          color: 'var(--text-primary, #f8fafc)',
          fontFamily: 'Inter, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: 580,
            width: '100%',
            background: 'var(--bg-card, #131d31)',
            border: '1px solid var(--border-default, #23304e)',
            borderRadius: '20px',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <AlertCircle size={32} />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Something went unexpected
            </h2>
            <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Quiziverse encountered an unexpected rendering hiccup. You can refresh the application or reset your session cache.
            </p>

            {this.state.error && (
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'left',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                color: '#f87171',
                marginBottom: '1.75rem',
                overflowX: 'auto',
                maxHeight: 140
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} /> Reload Page
              </button>

              <button
                onClick={this.handleResetStorage}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={16} /> Reset Session Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

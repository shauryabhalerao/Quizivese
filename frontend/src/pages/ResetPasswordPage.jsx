import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, KeyRound, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [resetTokenInput, setResetTokenInput] = useState(urlToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const activeToken = resetTokenInput.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;
    setError('');

    if (!activeToken) {
      setError('Please enter your 6-digit code or reset token.');
      return;
    }

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!confirmPassword) {
      setError('Please confirm your new password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/reset-password', { 
        token: activeToken, 
        password 
      });

      if (response?.success || response?.status === 200) {
        setIsSuccess(true);
      } else {
        throw new Error(response?.message || 'Failed to update password.');
      }
    } catch (err) {
      const msg = err.status === 400 || err.status === 404
        ? 'Invalid or expired password reset token / code.'
        : (err.message || 'Failed to update password. Please try again.');
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-narrow" style={{ padding: '3.5rem 1rem' }}>
      <div className="card glass-card" style={{ maxWidth: 480, margin: '0 auto', padding: '2.5rem 2rem' }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{
              background: 'var(--gradient-brand)',
              width: 52,
              height: 52,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              margin: '0 auto 1.25rem',
              boxShadow: 'var(--glow-brand)'
            }}>
              <Sparkles size={26} />
            </div>
          </Link>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Set New Password
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: 0 }}>
            Choose a new password for your Quiziverse account.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div 
            role="alert"
            style={{
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger)',
              color: '#f87171',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.35rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.88rem'
            }}
          >
            <AlertCircle size={19} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Screen */}
        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'var(--success-bg)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              border: '1px solid var(--success)'
            }}>
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Your password has been updated successfully.
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              You can now sign in using your new password.
            </p>

            <Link
              to="/login"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, justifyContent: 'center', textDecoration: 'none' }}
            >
              <span>Back to Login</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          /* Reset Form */
          <form onSubmit={handleSubmit} noValidate>
            {/* Token / 6-digit Code Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="reset-token-input">
                6-Digit Code or Reset Token
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reset-token-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 572544"
                  value={resetTokenInput}
                  onChange={(e) => setResetTokenInput(e.target.value)}
                  disabled={isSubmitting}
                  required
                  style={{ 
                    paddingLeft: '2.6rem', 
                    letterSpacing: resetTokenInput.length <= 8 ? '3px' : 'normal', 
                    fontWeight: 600, 
                    fontFamily: 'monospace' 
                  }}
                />
                <KeyRound 
                  size={18} 
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} 
                />
              </div>
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="new-password">
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                  style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                />
                <Lock 
                  size={18} 
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Repeat your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                  style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                />
                <Lock 
                  size={18} 
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ 
                width: '100%', 
                marginTop: '0.85rem', 
                padding: '0.9rem', 
                fontSize: '1rem',
                fontWeight: 700,
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Sparkles size={18} className="spin" />
                  <span>Updating Password…</span>
                </>
              ) : (
                <>
                  <span>Update Password</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        {!isSuccess && (
          <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
            <Link to="/login" style={{ color: 'var(--accent-indigo)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;

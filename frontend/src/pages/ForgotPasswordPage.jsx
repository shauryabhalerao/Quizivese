import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight, AlertCircle, CheckCircle, ArrowLeft, Copy, ExternalLink, Check, Terminal, KeyRound } from 'lucide-react';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/$/, '')}/api`;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailSent, setEmailSent] = useState(null);
  const [devResetLink, setDevResetLink] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setDevResetLink('');
    setResetToken('');
    setResetCode('');
    setPreviewUrl('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send password reset request');
      }

      const emailSentVal = data.emailSent !== undefined ? data.emailSent : (data.data?.emailSent ?? false);
      const link = data.devResetLink || data.data?.devResetLink || '';
      const code = data.resetCode || data.data?.resetCode || '';
      const etherealUrl = data.previewUrl || data.data?.previewUrl || '';

      setEmailSent(emailSentVal);
      if (link) setDevResetLink(link);
      if (code) setResetCode(code);
      if (etherealUrl) setPreviewUrl(etherealUrl);

      setSuccessMessage(data.message || 'Password reset code generated.');
    } catch (err) {
      if (err.message && err.message.includes('Load failed')) {
        setError('Cannot connect to API server. Please ensure the backend engine (http://localhost:5001) is running.');
      } else {
        setError(err.message || 'An error occurred while processing your request');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text, type) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } else if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2200);
    }
  };

  return (
    <div className="container-narrow" style={{ padding: '3rem 1rem' }}>
      <div className="card glass-card" style={{ maxWidth: 500, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'var(--gradient-brand)',
            width: 48,
            height: 48,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            margin: '0 auto 1rem',
            boxShadow: 'var(--glow-brand)'
          }}>
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Forgot Password</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Enter your registered email address to receive a single-use password reset link and 6-digit code.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div style={{
            background: 'var(--success-bg)',
            border: '1px solid var(--success)',
            color: '#34d399',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            fontSize: '0.875rem',
            lineHeight: 1.5
          }}>
            <CheckCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Reset Request Processed</strong>
              <p style={{ margin: '4px 0 0', opacity: 0.9 }}>{successMessage}</p>
            </div>
          </div>
        )}

        {/* 6-DIGIT CODE DISPLAY BOX */}
        {resetCode && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(56, 189, 248, 0.15))',
            border: '1px solid var(--accent-indigo)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--accent-indigo)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <KeyRound size={18} />
              <span>Your 6-Digit Verification Code</span>
            </div>

            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '8px',
              color: '#38bdf8',
              margin: '0.5rem 0 1rem',
              textShadow: '0 0 12px rgba(56, 189, 248, 0.4)'
            }}>
              {resetCode}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => copyToClipboard(resetCode, 'code')}
                className={`btn ${copiedCode ? 'btn-easy' : 'btn-indigo'} btn-sm`}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {copiedCode ? <Check size={15} /> : <Copy size={15} />}
                <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/reset-password?token=${resetCode}`)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1.2, justifyContent: 'center' }}
              >
                Reset Password Now <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Ethereal Mail Preview Box (if generated) */}
        {previewUrl && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <div style={{ fontSize: '0.825rem', color: 'var(--gold)' }}>
              <strong>Ethereal Email Inbox Preview</strong>
              <div style={{ opacity: 0.8, fontSize: '0.75rem' }}>View actual rendered HTML test email online</div>
            </div>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold btn-sm"
              style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              <ExternalLink size={14} /> Open Inbox
            </a>
          </div>
        )}

        {/* Development Reset Link Section (LOCAL DEVELOPMENT ONLY) */}
        {devResetLink && (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.825rem', marginBottom: '0.35rem' }}>
              <Terminal size={16} />
              <span>Direct Reset Link URL</span>
            </div>

            <div style={{ marginBottom: '0.65rem' }}>
              <input
                type="text"
                readOnly
                value={devResetLink}
                className="form-input"
                style={{ fontSize: '0.75rem', fontFamily: 'monospace', background: 'var(--bg-card)', color: 'var(--accent-indigo)' }}
                onClick={(e) => e.target.select()}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => copyToClipboard(devResetLink, 'link')}
                className={`btn ${copiedLink ? 'btn-easy' : 'btn-outline'} btn-sm`}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'Copied Link!' : 'Copy Direct Link'}</span>
              </button>

              <a
                href={devResetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
              >
                <ExternalLink size={14} /> Open Direct Link
              </a>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reset-email">Registered Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reset-email"
                type="email"
                className="form-input"
                placeholder="student@quiziverse.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending Link & Code...' : 'Send Reset Link & Code'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Back Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem' }}>
          <Link to="/login" style={{ color: 'var(--accent-indigo)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;


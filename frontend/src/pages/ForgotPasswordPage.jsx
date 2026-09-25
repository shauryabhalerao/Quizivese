import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight, AlertCircle, CheckCircle, ArrowLeft, KeyRound, Copy, ExternalLink, Check } from 'lucide-react';
import { api } from '../services/api';

import supabase from '../services/supabase';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [devResetLink, setDevResetLink] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    setSuccessMessage('');
    setDevResetLink('');
    setResetCode('');
    setPreviewUrl('');

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error: sbErr } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: redirectUrl
      });

      if (sbErr) {
        console.warn('[Supabase Reset Password Notice]:', sbErr.message);
        if (sbErr.status === 429 || sbErr.code === 'over_email_send_rate_limit') {
          setError('Too many password reset emails have been requested. Please wait a while and try again.');
          return;
        }
      }

      const response = await api.post('/auth/forgot-password', { email: trimmedEmail }).catch(() => null);
      
      setSuccessMessage("Password reset instructions sent. Please check your inbox.");

      if (response?.devResetLink) setDevResetLink(response.devResetLink);
      if (response?.resetCode) setResetCode(response.resetCode);
      if (response?.previewUrl) setPreviewUrl(response.previewUrl);
    } catch (err) {
      setSuccessMessage("Password reset instructions sent. Please check your inbox.");
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
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
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
            Reset your password
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: 0 }}>
            Enter your registered email address to receive password reset instructions.
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

        {/* Friendly Success Confirmation Message */}
        {successMessage && (
          <div 
            style={{
              background: 'var(--success-bg)',
              border: '1px solid var(--success)',
              color: '#34d399',
              padding: '0.95rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.35rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              fontSize: '0.88rem',
              lineHeight: 1.5
            }}
          >
            <CheckCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Request Sent</strong>
              <p style={{ margin: '3px 0 0', opacity: 0.95 }}>{successMessage}</p>
            </div>
          </div>
        )}

        {/* Interactive Verification Code Box (Local Dev Support) */}
        {resetCode && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(56, 189, 248, 0.12))',
            border: '1px solid var(--accent-indigo)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.35rem',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--accent-indigo)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.4rem' }}>
              <KeyRound size={17} />
              <span>Verification Code Generated</span>
            </div>

            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '8px',
              color: '#38bdf8',
              margin: '0.4rem 0 1rem',
              textShadow: '0 0 10px rgba(56, 189, 248, 0.3)'
            }}>
              {resetCode}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => copyToClipboard(resetCode, 'code')}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>

              <Link
                to={`/reset-password?token=${resetCode}`}
                className="btn btn-primary btn-sm"
                style={{ flex: 1.2, justifyContent: 'center', textDecoration: 'none' }}
              >
                <span>Reset Password</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Ethereal Inbox Link if available */}
        {previewUrl && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.35rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <div style={{ fontSize: '0.825rem', color: 'var(--gold)' }}>
              <strong>Ethereal Test Mail Inbox</strong>
            </div>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold btn-sm"
              style={{ textDecoration: 'none' }}
            >
              <ExternalLink size={14} /> View Email
            </a>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="reset-email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reset-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={isSubmitting}
                style={{ paddingLeft: '2.6rem' }}
              />
              <Mail 
                size={18} 
                aria-hidden="true"
                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} 
              />
            </div>
          </div>

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
                <span>Sending Instructions…</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
          <Link to="/login" style={{ color: 'var(--accent-indigo)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

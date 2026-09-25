import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, GraduationCap } from 'lucide-react';

const RegisterPage = () => {
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: 'Undergraduate'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect away from signup page
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password strength calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return null;
    if (pass.length < 8) return { label: 'Weak', score: 1, color: '#ef4444' };
    
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNum = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    const score = [hasUpper, hasLower, hasNum, hasSpecial].filter(Boolean).length;

    if (pass.length >= 10 && score >= 3) {
      return { label: 'Strong', score: 3, color: '#10b981' };
    }
    return { label: 'Medium', score: 2, color: '#f59e0b' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');

    // 1. Full Name Validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }

    // 2. Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    // 3. Password Validation
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    // 4. Confirm Password Validation
    if (!formData.confirmPassword) {
      setError('Please confirm your password.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        grade: formData.grade
      });

      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-narrow" style={{ padding: '3.5rem 1rem' }}>
      <div className="card glass-card" style={{ maxWidth: 500, margin: '0 auto', padding: '2.5rem 2rem' }}>
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
            Create your Quiziverse account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: 0 }}>
            Start learning, practicing, and improving with Quiziverse.
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

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Alex Johnson"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
                disabled={isSubmitting}
                style={{ paddingLeft: '2.6rem' }}
              />
              <User 
                size={18} 
                aria-hidden="true"
                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} 
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
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

          {/* Education Level (Optional) */}
          <div className="form-group">
            <label className="form-label" htmlFor="grade">
              Education Level <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>(Optional)</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="grade"
                name="grade"
                className="form-select"
                value={formData.grade}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{ paddingLeft: '2.6rem' }}
              >
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate (College / University)</option>
                <option value="Graduate">Graduate / Postgraduate</option>
                <option value="Self-Learner">Self-Taught / Professional</option>
              </select>
              <GraduationCap 
                size={18} 
                aria-hidden="true"
                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} 
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
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

            {/* Password Strength Indicator */}
            {passwordStrength && (
              <div style={{ marginTop: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Password Strength:</span>
                  <span style={{ color: passwordStrength.color, fontWeight: 700 }}>{passwordStrength.label}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      style={{
                        flex: 1,
                        borderRadius: '2px',
                        background: step <= passwordStrength.score ? passwordStrength.color : 'var(--border-subtle)',
                        transition: 'background 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                <span>Creating Account…</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-indigo)', fontWeight: 700, textDecoration: 'none' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

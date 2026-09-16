import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  LayoutDashboard, 
  Compass, 
  Trophy, 
  Award, 
  Bot, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Flame, 
  Coins, 
  UserCircle2 
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout, login, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handleRoleToggle = () => {
    if (isAdmin) {
      login('student@quiziverse.io', '', 'student');
    } else {
      login('admin@quiziverse.io', '', 'admin');
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
          <div style={{
            background: 'var(--gradient-brand)',
            width: 38,
            height: 38,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={20} />
          </div>
          <span>Quizi<span className="brand-gradient">verse</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={17} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/quizzes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Compass size={17} /> Quizzes
            </NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Trophy size={17} /> Leaderboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/achievements" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Award size={17} /> Badges
            </NavLink>
          </li>
          <li>
            <NavLink to="/ai-quiz" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Bot size={17} /> AI Generator
            </NavLink>
          </li>
          {isAdmin && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: '#ec4899' }}>
                <ShieldCheck size={17} /> Admin Panel
              </NavLink>
            </li>
          )}
        </ul>

        {/* Right Actions / User Status */}
        <div className="nav-actions">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {/* Quick Role Switcher for Phase 1 Testing */}
              <button 
                onClick={handleRoleToggle}
                className="btn btn-sm btn-outline"
                title="Toggle between Student and Admin mock view"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
              >
                Role: <strong style={{ color: isAdmin ? '#ec4899' : '#38bdf8', marginLeft: 4 }}>{currentUser.role}</strong>
              </button>

              {/* Streak Badge */}
              <div 
                title="Current Daily Quiz Streak"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--gold)',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                <Flame size={15} />
                <span>{currentUser.streak || 1}d</span>
              </div>

              {/* User Profile Pill */}
              <div className="user-profile-pill">
                <div className="user-avatar">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-meta" style={{ display: 'none', minWidth: 70 }}>
                  <span className="user-name">{currentUser.name.split(' ')[0]}</span>
                  <span className="user-points">
                    <Coins size={11} style={{ display: 'inline', marginRight: 2 }} />
                    {currentUser.points || 0} pts
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout} 
                className="btn btn-ghost btn-sm"
                title="Sign out"
                style={{ padding: '0.4rem' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-sm btn-outline">Log In</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Sign Up</Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button 
            className="btn btn-ghost btn-sm" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
            id="mobile-nav-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 72,
          left: 0,
          right: 0,
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-default)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          zIndex: 40,
          boxShadow: 'var(--shadow-lg)'
        }}>
          <NavLink to="/dashboard" className="nav-link" onClick={closeMobileMenu}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/quizzes" className="nav-link" onClick={closeMobileMenu}>
            <Compass size={18} /> Quizzes
          </NavLink>
          <NavLink to="/leaderboard" className="nav-link" onClick={closeMobileMenu}>
            <Trophy size={18} /> Leaderboard
          </NavLink>
          <NavLink to="/achievements" className="nav-link" onClick={closeMobileMenu}>
            <Award size={18} /> Badges
          </NavLink>
          <NavLink to="/ai-quiz" className="nav-link" onClick={closeMobileMenu}>
            <Bot size={18} /> AI Generator
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className="nav-link" onClick={closeMobileMenu} style={{ color: '#ec4899' }}>
              <ShieldCheck size={18} /> Admin Panel
            </NavLink>
          )}
          {currentUser && (
            <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ marginTop: '0.5rem', justifyContent: 'flex-start' }}>
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import JoinCodeModal from './JoinCodeModal';
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
  Sun,
  Moon,
  PlusCircle,
  Zap,
  KeyRound,
  GraduationCap,
  History
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout, login, isAdmin, isTeacher } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleRoleToggle = () => {
    if (currentUser?.role === 'student') {
      login('teacher@quiziverse.io', '', 'teacher');
    } else if (currentUser?.role === 'teacher') {
      login('admin@quiziverse.io', '', 'admin');
    } else {
      login('student@quiziverse.io', '', 'student');
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      {/* ROW 1: Brand & User Account Header Bar */}
      <div className="navbar-row-top">
        <div className="container navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
            <div className="brand-icon-box">
              <Sparkles size={20} />
            </div>
            <span>Quizi<span className="brand-gradient">verse</span></span>
          </Link>

          {/* Right Actions / Account & Controls */}
          <div className="nav-actions">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-theme-toggle"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {currentUser ? (
              <div className="nav-user-group">
                {/* Role Switcher */}
                <button 
                  onClick={handleRoleToggle}
                  className="btn btn-sm btn-outline nav-role-btn"
                  title="Click to cycle between Student, Teacher, and Admin roles"
                >
                  Role: <strong className={`role-text role-${currentUser?.role}`}>{currentUser.role}</strong>
                </button>

                {/* Daily Streak Badge */}
                <div 
                  title="Current Daily Quiz Streak"
                  className="nav-streak-badge"
                >
                  <Flame size={15} />
                  <span>{currentUser.streak || 1}d</span>
                </div>

                {/* User Profile Pill */}
                <div className="user-profile-pill" title={currentUser?.name || 'User Profile'}>
                  <div className="user-avatar">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="user-name">{currentUser?.name || 'Student'}</span>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout} 
                  className="btn btn-ghost btn-sm nav-logout-btn"
                  title="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="nav-auth-buttons">
                <Link to="/login" className="btn btn-sm btn-outline">Log In</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Sign Up</Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button 
              className="btn btn-ghost btn-sm mobile-nav-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-nav-toggle"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ROW 2: Navigation Links (Centered, Horizontally Balanced) */}
      <div className="navbar-row-bottom">
        <div className="container navbar-container-bottom">
          <ul className="nav-links">
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/history" className={({ isActive }) => `nav-link nav-link-pink ${isActive ? 'active' : ''}`}>
                <History size={16} /> History
              </NavLink>
            </li>
            <li>
              <NavLink to="/quizzes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Compass size={16} /> Quizzes
              </NavLink>
            </li>
            <li>
              <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Trophy size={16} /> Leaderboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/achievements" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Award size={16} /> Badges
              </NavLink>
            </li>
            <li>
              <NavLink to="/ai-quiz" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Bot size={16} /> AI Generator
              </NavLink>
            </li>
            <li>
              <NavLink to="/live-quiz" className={({ isActive }) => `nav-link nav-link-amber ${isActive ? 'active' : ''}`}>
                <span className="live-pill">
                  <Zap size={15} fill="currentColor" />
                  <span>Live Arena</span>
                  <span className="live-pulse-dot"></span>
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/create-quiz" className={({ isActive }) => `nav-link nav-link-cyan ${isActive ? 'active' : ''}`}>
                <PlusCircle size={16} /> Create Quiz
              </NavLink>
            </li>
            {(isTeacher || isAdmin) && (
              <li>
                <NavLink to="/teacher" className={({ isActive }) => `nav-link nav-link-purple ${isActive ? 'active' : ''}`}>
                  <GraduationCap size={16} /> Teacher Portal
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li>
                <NavLink to="/admin" className={({ isActive }) => `nav-link nav-link-pink ${isActive ? 'active' : ''}`}>
                  <ShieldCheck size={16} /> Admin Panel
                </NavLink>
              </li>
            )}
            <li>
              <button
                type="button"
                onClick={() => setIsJoinModalOpen(true)}
                className="nav-link nav-join-link-btn"
                title="Enter Quiz Code to join test"
              >
                <KeyRound size={15} color="var(--primary)" /> Join Code
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <button
            onClick={() => { closeMobileMenu(); setIsJoinModalOpen(true); }}
            className="btn btn-outline btn-sm mobile-join-code-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}
          >
            <KeyRound size={16} color="#6366f1" /> Join Quiz with Code
          </button>
          <NavLink to="/dashboard" className="nav-link" onClick={closeMobileMenu}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/history" className="nav-link nav-link-pink" onClick={closeMobileMenu}>
            <History size={18} /> History
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
          <NavLink to="/live-quiz" className="nav-link nav-link-amber" onClick={closeMobileMenu}>
            <Zap size={18} fill="currentColor" /> Live Arena
          </NavLink>
          <NavLink to="/create-quiz" className="nav-link nav-link-cyan" onClick={closeMobileMenu}>
            <PlusCircle size={18} /> Create Quiz
          </NavLink>
          {(isTeacher || isAdmin) && (
            <NavLink to="/teacher" className="nav-link nav-link-purple" onClick={closeMobileMenu}>
              <GraduationCap size={18} /> Teacher Portal
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className="nav-link nav-link-pink" onClick={closeMobileMenu}>
              <ShieldCheck size={18} /> Admin Panel
            </NavLink>
          )}
          <div className="mobile-drawer-footer">
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Appearance Theme</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {theme === 'dark' ? <><Sun size={15} /> Light Mode</> : <><Moon size={15} /> Dark Mode</>}
            </button>
          </div>
          {currentUser && (
            <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ marginTop: '0.5rem', justifyContent: 'flex-start' }}>
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </div>
      )}

      {/* Join Code Modal */}
      <JoinCodeModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;

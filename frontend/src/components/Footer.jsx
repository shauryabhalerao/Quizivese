import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Heart, ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand & Philosophy */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'var(--gradient-brand)',
                width: 32,
                height: 32,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Sparkles size={16} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Quizi<span className="brand-gradient">verse</span></h3>
            </div>
            <p style={{ maxWidth: 360, lineHeight: 1.6, fontSize: '0.875rem' }}>
              An enterprise-grade AI-powered quiz platform empowering students to test knowledge, earn gamified achievements, climb global leaderboards, and generate custom study challenges.
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div className="footer-col">
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><Link to="/quizzes">All Quizzes</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              <li><Link to="/achievements">Achievements</Link></li>
              <li><Link to="/ai-quiz">AI Quiz Generator</Link></li>
            </ul>
          </div>

          {/* Col 3: Student Account */}
          <div className="footer-col">
            <h4>Student Center</h4>
            <ul className="footer-links">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/login">Student Login</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/admin">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Architecture */}
          <div className="footer-col">
            <h4>Engineering</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div>⚡ Multi-User Architecture</div>
              <div>🔒 JWT Authentication</div>
              <div>🧠 Modular AI Service</div>
              <div>📊 Relational Database</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Quiziverse. Built with React, Node.js, Express & SQL.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Production-Ready Educational Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

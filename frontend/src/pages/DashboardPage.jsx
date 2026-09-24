import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import { 
  BookOpen, 
  Percent, 
  Coins, 
  Flame, 
  Trophy, 
  Zap, 
  Bot, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award,
  Sparkles,
  Target,
  BarChart3,
  History,
  TrendingUp,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { achievements } = useQuiz();

  const [stats, setStats] = useState({
    testsAttempted: 0,
    averageScore: 0,
    bestScore: 0,
    questionsAttempted: 0,
    accuracy: 0,
    recentTests: [],
    weakTopics: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/attempts/stats');
      if (res?.data?.stats) {
        setStats(res.data.stats);
      }
    } catch (e) {
      console.warn('[STATS LOAD NOTICE]: Using default stats');
    } finally {
      setLoading(false);
    }
  };

  const user = currentUser || {
    name: 'Explorer',
    points: 100,
    xp: 200,
    level: 1,
    streak: 1,
    rank: 6
  };

  const currentLevelXp = (user.xp || 0) % 1000;
  const levelProgressPct = Math.min(Math.round((currentLevelXp / 1000) * 100), 100);
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Student Welcome Header & Level Bar */}
      <div className="card glass-card" style={{ 
        marginBottom: '2rem', 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(236, 72, 153, 0.12) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-gold">
                Level {user.level || 1} • {
                  (user.level || 1) <= 2 ? 'Apprentice Initiate' :
                  (user.level || 1) <= 4 ? 'Knowledge Seeker' :
                  (user.level || 1) <= 6 ? 'Master Scholar' :
                  (user.level || 1) <= 9 ? 'Quiz Luminary' : 'Quiziverse Grandmaster'
                }
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>• {user.grade || 'Student'}</span>
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>
              Welcome back, <span className="brand-gradient">{user.name}</span>! ✨
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: 4 }}>
              Ready to expand your galaxy? You're on a <strong>{user.streak || 1}-day streak</strong>!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/ai-quiz" className="btn btn-gold">
              <Bot size={16} /> AI Quiz Gen
            </Link>
            <Link to="/history" className="btn btn-outline">
              <History size={16} /> Test History
            </Link>
          </div>
        </div>

        {/* Level XP Progress */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Level {user.level || 1} Progress ({currentLevelXp} / 1000 XP)
            </span>
            <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
              {1000 - currentLevelXp} XP to Level {(user.level || 1) + 1}
            </span>
          </div>
          <div className="progress-track" style={{ margin: 0, height: 10 }}>
            <div className="progress-fill" style={{ width: `${levelProgressPct}%` }}></div>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          icon={BookOpen}
          label="Tests Attempted"
          value={stats.testsAttempted}
          subtext="Total completed tests"
          accentColor="indigo"
        />
        <StatCard
          icon={Percent}
          label="Average Score"
          value={`${stats.averageScore}%`}
          subtext="Mean percentage"
          accentColor="emerald"
        />
        <StatCard
          icon={Trophy}
          label="Best Score"
          value={`${stats.bestScore}%`}
          subtext="Personal record"
          accentColor="amber"
        />
        <StatCard
          icon={HelpCircle}
          label="Questions Answered"
          value={stats.questionsAttempted}
          subtext="Total questions"
          accentColor="purple"
        />
        <StatCard
          icon={TrendingUp}
          label="Overall Accuracy"
          value={`${stats.accuracy}%`}
          subtext="Correct vs total"
          accentColor="cyan"
        />
      </div>

      {/* Weak Areas Diagnostics & Category Progress Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Weak Areas Diagnostics */}
        <div className="card glass-card" style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={20} color="#f87171" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Targeted Weak Topics</h2>
              </div>
              <span className="badge badge-hard">Focus Practice</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Topics where your accuracy is under 70%. Generate targeted practice drills to master them:
            </p>

            {stats.weakTopics.length === 0 ? (
              <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                ✓ No critical weak topics identified! Keep up the great work.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {stats.weakTopics.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.topic}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.correct} / {item.total} correct</div>
                    </div>
                    <Link
                      to={`/ai-quiz?topic=${encodeURIComponent(item.topic)}&mode=weak-practice`}
                      className="badge badge-hard"
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {item.percentage}% Practice <ArrowUpRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Link 
              to="/ai-quiz" 
              className="btn btn-gold"
              style={{ flex: 1, justifyContent: 'center', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)' }}
            >
              <Zap size={16} fill="currentColor" /> Generate Custom Drill
            </Link>
          </div>
        </div>

        {/* Category Mastery Grid */}
        <div className="card glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="#818cf8" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Domain Proficiency</h2>
            </div>
            <span className="badge badge-indigo">Active Skills</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {[
              { category: "Web Development", mastery: 91, color: "#3b82f6" },
              { category: "Programming & Data Structures", mastery: 82, color: "#6366f1" },
              { category: "Database Systems & SQL", mastery: 74, color: "#14b8a6" },
              { category: "Artificial Intelligence", mastery: 68, color: "#ec4899" }
            ].map(cat => (
              <div key={cat.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600 }}>{cat.category}</span>
                  <span style={{ fontWeight: 700, color: cat.mastery >= 75 ? '#34d399' : '#fbbf24' }}>
                    {cat.mastery}%
                  </span>
                </div>
                <div className="progress-track" style={{ height: 8, margin: 0 }}>
                  <div className="progress-fill" style={{ width: `${cat.mastery}%`, background: cat.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Attempts Table & Achievements */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gap: '1.75rem',
        alignItems: 'start'
      }}>
        {/* Recent Attempts Table */}
        <div className="card glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recent Test Attempts</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Logged-in user's recent submissions</p>
            </div>
            <Link to="/history" className="btn btn-outline btn-sm">
              View All History <ArrowRight size={14} />
            </Link>
          </div>

          {stats.recentTests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <BookOpen size={36} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.95rem' }}>No quiz attempts yet. Generate an AI quiz to start!</p>
              <Link to="/ai-quiz" className="btn btn-gold btn-sm" style={{ marginTop: '0.75rem', display: 'inline-flex' }}>
                <Sparkles size={14} /> Generate AI Quiz
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Test Name</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Score</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Review</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTests.map(att => (
                    <tr key={att.attemptId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.9rem 0.5rem', fontWeight: 600 }}>
                        <div>{att.quizTitle}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{att.source || 'AI Quiz'}</div>
                      </td>
                      <td style={{ padding: '0.9rem 0.5rem' }}>
                        <span style={{ fontWeight: 700, color: att.percentage >= 70 ? 'var(--success)' : 'var(--danger)' }}>
                          {att.percentage}%
                        </span>{' '}
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                          ({att.score}/{att.totalQuestions})
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 0.5rem' }}>
                        <span className={`badge ${att.percentage >= 70 ? 'badge-easy' : 'badge-hard'}`}>
                          {att.percentage >= 70 ? 'Passed' : 'Practice'}
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 0.5rem', textAlign: 'right' }}>
                        <Link 
                          to={`/results/${att.attemptId}`} 
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Earned Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} color="#f59e0b" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Earned Badges</h3>
              </div>
              <Link to="/achievements" style={{ fontSize: '0.85rem', color: 'var(--accent-indigo)' }}>
                View All ({unlockedAchievements.length})
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {unlockedAchievements.slice(0, 3).map(ach => (
                <div 
                  key={ach.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: 'var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Award size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{ach.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{ach.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

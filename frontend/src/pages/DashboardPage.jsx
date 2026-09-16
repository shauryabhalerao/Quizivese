import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
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
  BarChart3
} from 'lucide-react';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { attempts, achievements } = useQuiz();

  const user = currentUser || {
    name: 'Explorer',
    points: 100,
    xp: 200,
    level: 1,
    streak: 1,
    rank: 25,
    quizzesAttempted: 0,
    averagePercentage: 0
  };

  // Calculate level progress (e.g. Level 5 requires 5000 XP total, current progress within 1000 range)
  const currentLevelXp = (user.xp || 0) % 1000;
  const levelProgressPct = Math.min(Math.round((currentLevelXp / 1000) * 100), 100);

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);

  return (
    <div className="container">
      {/* Student Welcome Header & Level Bar */}
      <div className="card glass-card" style={{ marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
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
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Welcome back, <span className="brand-gradient">{user.name}</span>!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: 4 }}>
              Ready to expand your galaxy? You're on a <strong>{user.streak || 1}-day streak</strong> (All-time best: {user.longestStreak || user.streak || 1} days)!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/quizzes" className="btn btn-primary">
              <Play size={16} fill="currentColor" /> Take a Quiz
            </Link>
            <Link to="/ai-quiz" className="btn btn-gold">
              <Bot size={16} /> AI Quiz Gen
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <StatCard
          icon={BookOpen}
          label="Quizzes Attempted"
          value={user.quizzesAttempted ?? attempts.length}
          subtext="Total completed"
          accentColor="indigo"
        />
        <StatCard
          icon={Percent}
          label="Average Accuracy"
          value={`${user.averagePercentage || 85}%`}
          subtext="Overall performance"
          accentColor="emerald"
        />
        <StatCard
          icon={Coins}
          label="Total Points"
          value={user.points?.toLocaleString() || '2,650'}
          subtext="Redeemable score"
          accentColor="amber"
        />
        <StatCard
          icon={Flame}
          label="Daily Streak"
          value={`${user.streak || 4} Days`}
          subtext="Keep practicing daily!"
          accentColor="purple"
        />
        <StatCard
          icon={Trophy}
          label="Leaderboard Rank"
          value={`#${user.rank || 6}`}
          subtext="Top 5% of students"
          accentColor="cyan"
        />
      </div>

      {/* Category Mastery Progress & Weak Areas Diagnostics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Category Progress Bars */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="#818cf8" />
              <h2 style={{ fontSize: '1.25rem' }}>Category Mastery</h2>
            </div>
            <span className="badge badge-indigo">5 Active Tracks</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {[
              { category: "Web Development", mastery: 91, color: "#3b82f6" },
              { category: "Programming", mastery: 82, color: "#6366f1" },
              { category: "Aptitude", mastery: 74, color: "#f59e0b" },
              { category: "SQL & Databases", mastery: 68, color: "#14b8a6" },
              { category: "Artificial Intelligence", mastery: 55, color: "#ec4899" }
            ].map(cat => (
              <div key={cat.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600 }}>{cat.category}</span>
                  <span style={{ fontWeight: 700, color: cat.mastery >= 75 ? '#34d399' : cat.mastery >= 60 ? '#fbbf24' : '#f87171' }}>
                    {cat.mastery}% Mastery
                  </span>
                </div>
                <div className="progress-track" style={{ height: 8, margin: 0 }}>
                  <div 
                    className="progress-fill" 
                    style={{ width: `${cat.mastery}%`, background: cat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Areas Diagnostics Card */}
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
                <h2 style={{ fontSize: '1.25rem' }}>Weak Area Diagnostics</h2>
              </div>
              <span className="badge badge-hard">Priority Growth</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              AI analysis of your recent quiz attempts shows opportunities to boost your score in these specific sub-topics:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>SQL Joins & Aggregations</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>48% accuracy • Avg response 42s</div>
                </div>
                <span className="badge badge-hard">48%</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dynamic Programming & Trees</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>52% accuracy • Avg response 65s</div>
                </div>
                <span className="badge badge-medium">52%</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link 
              to="/ai-quiz?topic=SQL%20Joins%20%26%20Aggregations&mode=weak-practice" 
              className="btn btn-gold"
              style={{ flex: 1, justifyContent: 'center', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)' }}
            >
              <Zap size={16} fill="currentColor" /> Practice Weak Areas
            </Link>
            <Link 
              to="/ai-quiz" 
              className="btn btn-secondary"
              style={{ padding: '0.5rem 0.85rem' }}
            >
              AI Drill
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Attempts & Badges Showcase */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gap: '1.75rem',
        alignItems: 'start'
      }}>
        {/* Left: Recent Attempts Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Recent Quiz Attempts</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Review your past scores and answer breakdowns</p>
            </div>
            <Link to="/quizzes" className="btn btn-outline btn-sm">
              Take New Quiz <ArrowRight size={14} />
            </Link>
          </div>

          {attempts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <BookOpen size={36} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>No quiz attempts yet. Start your first quiz today!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Quiz Title</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Score</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>XP</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Review</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map(att => (
                    <tr key={att.attemptId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                        {att.quizTitle}
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span style={{ fontWeight: 700, color: att.percentage >= 70 ? '#34d399' : '#f87171' }}>
                          {att.percentage}%
                        </span>{' '}
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                          ({att.score}/{att.totalQuestions})
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span className={`badge ${att.percentage >= 70 ? 'badge-easy' : 'badge-hard'}`}>
                          {att.status || (att.percentage >= 70 ? 'Passed' : 'Review')}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--gold)', fontWeight: 600 }}>
                        +{att.xpEarned || 200} XP
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <Link 
                          to={`/results/${att.attemptId}`} 
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.75rem' }}
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

        {/* Right: Badges Showcase & Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Unlocked Badges */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} color="#f59e0b" />
                <h3 style={{ fontSize: '1.1rem' }}>Earned Badges ({unlockedAchievements.length})</h3>
              </div>
              <Link to="/achievements" style={{ fontSize: '0.85rem', color: 'var(--accent-indigo)' }}>
                View All
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
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: 'var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Award size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ach.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{ach.description}</div>
                  </div>
                  <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                    +{ach.xpAward} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Fast-Jump Card */}
          <div className="card" style={{ background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, var(--bg-card) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <Trophy size={20} color="#fbbf24" />
              <h3 style={{ fontSize: '1.1rem' }}>Galaxy Leaderboard</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              You are currently ranked <strong>#{user.rank || 6}</strong>. 
              Earn 450 more points this week to break into the Top 5!
            </p>
            <Link to="/leaderboard" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              Open Leaderboard Standings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

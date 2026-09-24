import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import StatCard from '../components/StatCard';
import { 
  BookOpen, 
  Plus, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  BarChart3, 
  Trash2, 
  Edit, 
  Copy, 
  Check, 
  Play, 
  Eye, 
  Zap, 
  RefreshCw,
  Clock,
  Layers,
  Award,
  AlertTriangle
} from 'lucide-react';

const TeacherDashboardPage = () => {
  const { currentUser } = useAuth();
  const { quizzes, attempts, deleteQuiz, clearAllQuizzes, resetQuizzesToDefault } = useQuiz();
  const [copiedCode, setCopiedCode] = useState(null);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'active' | 'draft'
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  // Metrics
  const totalQuizzes = quizzes.length;
  const activeQuizzes = quizzes.filter(q => q.isActive).length;
  const totalAttemptsCount = attempts.length;
  const avgClassScore = attempts.length > 0
    ? Math.round(attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / attempts.length)
    : 84;

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleClearDemoQuizzes = () => {
    if (window.confirm('Are you sure you want to remove all sample quizzes? This will clear the catalog so you can populate it entirely with your own curriculum.')) {
      clearAllQuizzes();
      setNotification('Sample quizzes cleared. You can now publish your own custom quizzes!');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset quiz catalog back to factory defaults?')) {
      resetQuizzesToDefault();
      setNotification('Sample quizzes restored successfully.');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleDeleteOne = (id, title) => {
    if (window.confirm(`Delete quiz "${title}"?`)) {
      deleteQuiz(id);
      setNotification(`Quiz "${title}" removed.`);
      setTimeout(() => setNotification(''), 3500);
    }
  };

  const filteredQuizzes = quizzes.filter(q => {
    if (filterTab === 'active') return q.isActive;
    if (filterTab === 'draft') return !q.isActive;
    return true;
  });

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      {/* Welcome Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-indigo)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
            <BookOpen size={16} /> FACULTY & INSTRUCTOR CONTROL PORTAL
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Teacher Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Welcome back, <strong>{currentUser?.name || 'Educator'}</strong>. Manage classroom quizzes, review student marks, and author AI curricula.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/create-quiz" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Manual Quiz Creator
          </Link>
          <Link to="/ai-quiz" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color="#8b5cf6" /> AI Quiz Generator
          </Link>
          <Link to="/live-quiz" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Zap size={16} color="#fbbf24" fill="currentColor" /> Live Arena Room
          </Link>
        </div>
      </div>

      {notification && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid #10b981',
          color: '#34d399',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <StatCard
          title="Quizzes in Library"
          value={totalQuizzes}
          icon={Layers}
          color="#6366f1"
          subtitle={`${activeQuizzes} currently published & active`}
        />
        <StatCard
          title="Student Attempts"
          value={totalAttemptsCount}
          icon={Users}
          color="#38bdf8"
          subtitle="Evaluated across all subjects"
        />
        <StatCard
          title="Average Class Accuracy"
          value={`${avgClassScore}%`}
          icon={BarChart3}
          color="#10b981"
          subtitle="Passing standard: 70%"
        />
        <StatCard
          title="Live Arena Codes"
          value={activeQuizzes}
          icon={Award}
          color="#f59e0b"
          subtitle="Instant 4-7 digit join access"
        />
      </div>

      {/* Custom Content Management Banner (Remove what we gave, add your own) */}
      <div className="card glass-card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(236, 72, 153, 0.08))',
        border: '1px solid var(--border-default)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Customize Platform Content
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Make this website 100% your own! You can wipe default sample quizzes with one click, or restore them anytime.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleClearDemoQuizzes}
            className="btn btn-danger btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            title="Wipes sample quizzes so only your custom quizzes appear"
          >
            <Trash2 size={15} /> Clear All Sample Quizzes
          </button>
          <button
            onClick={handleResetDefaults}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            title="Reloads factory seed quizzes"
          >
            <RefreshCw size={15} /> Reset to Defaults
          </button>
        </div>
      </div>

      {/* My Quizzes Management Section */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Curriculum & Quiz Management</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Share unique Quiz Codes with students to let them join assessments instantly.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setFilterTab('all')}
              className={`btn btn-sm ${filterTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
            >
              All ({totalQuizzes})
            </button>
            <button
              onClick={() => setFilterTab('active')}
              className={`btn btn-sm ${filterTab === 'active' ? 'btn-primary' : 'btn-outline'}`}
            >
              Active ({activeQuizzes})
            </button>
            <button
              onClick={() => setFilterTab('draft')}
              className={`btn btn-sm ${filterTab === 'draft' ? 'btn-primary' : 'btn-outline'}`}
            >
              Drafts ({totalQuizzes - activeQuizzes})
            </button>
          </div>
        </div>

        {filteredQuizzes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Layers size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
            <h3>No Quizzes Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You haven't created any quizzes in this view yet. Start building your custom curriculum!
            </p>
            <Link to="/create-quiz" className="btn btn-primary">
              <Plus size={16} /> Create Your First Quiz
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-default)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Quiz Title</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Quiz Code</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Subject / Category</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Difficulty</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Time</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Questions</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuizzes.map(quiz => {
                  const code = quiz.quizCode || quiz.id.slice(0, 7).toUpperCase();
                  const isCopied = copiedCode === code;

                  return (
                    <tr key={quiz.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        <Link to={`/quiz/${quiz.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {quiz.title}
                        </Link>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <button
                          onClick={() => handleCopyCode(code)}
                          title="Click to copy quiz code for students"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            background: 'rgba(99, 102, 241, 0.12)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            padding: '0.25rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--accent-indigo)',
                            fontWeight: 800,
                            fontFamily: 'monospace',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          {code}
                          {isCopied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                        </button>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                        {quiz.category}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${
                          quiz.difficulty === 'Easy' ? 'badge-easy' :
                          quiz.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium'
                        }`}>
                          {quiz.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                        {quiz.timeLimitMinutes} min
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                        {quiz.questions?.length || 5} Qs
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${quiz.isActive ? 'badge-easy' : 'badge-gray'}`}>
                          {quiz.isActive ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                          <Link 
                            to={`/quiz/${quiz.id}`} 
                            className="btn btn-ghost btn-sm"
                            title="Preview / Take Quiz"
                            style={{ padding: '0.35rem' }}
                          >
                            <Play size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteOne(quiz.id, quiz.title)}
                            className="btn btn-ghost btn-sm"
                            title="Delete Quiz"
                            style={{ padding: '0.35rem', color: '#ef4444' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Classroom Attempts & Performance Log */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Classroom Assessment Audit Trail</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Granular review of student submissions, scores, accuracy, and evaluation dates.
            </p>
          </div>
          <Link to="/leaderboard" className="btn btn-outline btn-sm">
            View Leaderboards
          </Link>
        </div>

        {attempts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>
            No student submissions recorded yet. Share a quiz code to start collecting student attempts!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-default)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Attempt ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Quiz Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Marks / Score</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Accuracy</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Outcome</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Time Spent</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Review</th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, 10).map((a, i) => (
                  <tr key={a.attemptId || i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {(a.attemptId || 'att-101').slice(0, 12)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                      {a.quizTitle}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-indigo)' }}>
                      {a.marksObtained !== undefined ? a.marksObtained : (a.correctCount ?? a.score)} / {a.totalMarks || a.totalQuestions} Marks
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        fontWeight: 700,
                        color: a.percentage >= 70 ? '#10b981' : '#f59e0b'
                      }}>
                        {a.percentage}%
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge ${a.percentage >= 70 ? 'badge-easy' : 'badge-medium'}`}>
                        {a.percentage >= 70 ? 'Passed' : 'Needs Practice'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                      {Math.floor((a.timeTakenSeconds || 120) / 60)}m {(a.timeTakenSeconds || 120) % 60}s
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <Link to={`/results/${a.attemptId}`} className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}>
                        View Breakdown
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboardPage;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
  History, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/attempts/history');
      if (res?.data?.attempts) {
        setAttempts(res.data.attempts);
      } else {
        setAttempts([]);
      }
    } catch (err) {
      console.warn('[HISTORY LOAD ERROR]:', err.message);
      setError(err.message || 'Could not load quiz history');
    } finally {
      setLoading(false);
    }
  };

  const getSourceIcon = (source = '') => {
    const s = String(source).toLowerCase();
    if (s.includes('pdf') || s.includes('upload')) return <FileText size={14} style={{ color: 'var(--accent-indigo)' }} />;
    if (s.includes('image') || s.includes('photo')) return <ImageIcon size={14} style={{ color: '#ec4899' }} />;
    if (s.includes('notes')) return <FileText size={14} style={{ color: 'var(--success)' }} />;
    if (s.includes('manual')) return <BookOpen size={14} style={{ color: 'var(--gold)' }} />;
    return <Sparkles size={14} style={{ color: 'var(--gold)' }} />;
  };

  const getSourceBadgeClass = (source = '') => {
    const s = String(source).toLowerCase();
    if (s.includes('pdf') || s.includes('upload')) return 'badge-indigo';
    if (s.includes('image') || s.includes('photo')) return 'badge-pink';
    if (s.includes('notes')) return 'badge-emerald';
    return 'badge-gold';
  };

  const filteredAttempts = attempts.filter(att => {
    const titleMatch = (att.quizTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (att.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!titleMatch) return false;
    
    if (activeFilter === 'passed') return att.percentage >= 70;
    if (activeFilter === 'ai') return (att.source || '').toLowerCase().includes('ai') || (att.quizTitle || '').toLowerCase().includes('ai');
    if (activeFilter === 'uploads') return (att.source || '').toLowerCase().includes('upload') || (att.source || '').toLowerCase().includes('pdf');
    return true;
  });

  // Calculate summary metrics
  const totalAttempts = attempts.length;
  const avgScore = totalAttempts > 0 
    ? Math.round(attempts.reduce((sum, a) => sum + (Number(a.percentage) || 0), 0) / totalAttempts) 
    : 0;
  const totalQuestionsAnswered = attempts.reduce((sum, a) => sum + (Number(a.totalQuestions) || 0), 0);

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Header Banner */}
      <div className="card glass-card" style={{ 
        marginBottom: '2rem', 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(236, 72, 153, 0.12))',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(236, 72, 153, 0.15)',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              color: '#ec4899',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '0.75rem'
            }}>
              <History size={15} /> Personal Learning Vault
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Test & Quiz History
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
              Review your past test performances, detailed answer explanations, and accuracy trends.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/ai-quiz" className="btn btn-gold">
              <Sparkles size={16} /> Generate New AI Quiz
            </Link>
          </div>
        </div>

        {/* Quick Summary Pills */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px dashed rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Total Tests Taken</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>{totalAttempts}</div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Average Accuracy</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{avgScore}%</div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Questions Answered</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold)' }}>{totalQuestionsAnswered}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search history by test name or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)' }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-secondary)', padding: '0.3rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-default)' }}>
          <button
            onClick={() => setActiveFilter('all')}
            className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.3rem 0.85rem', fontSize: '0.82rem' }}
          >
            All Tests
          </button>
          <button
            onClick={() => setActiveFilter('passed')}
            className={`btn btn-sm ${activeFilter === 'passed' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.3rem 0.85rem', fontSize: '0.82rem' }}
          >
            Passed (70%+)
          </button>
          <button
            onClick={() => setActiveFilter('ai')}
            className={`btn btn-sm ${activeFilter === 'ai' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.3rem 0.85rem', fontSize: '0.82rem' }}
          >
            AI Quizzes
          </button>
          <button
            onClick={() => setActiveFilter('uploads')}
            className={`btn btn-sm ${activeFilter === 'uploads' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.3rem 0.85rem', fontSize: '0.82rem' }}
          >
            Uploads / PDF
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
          <Sparkles size={32} className="spin" style={{ color: 'var(--accent-indigo)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Retrieving your test vault...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Fetching authenticated quiz attempts from backend</p>
        </div>
      )}

      {/* Error Notice */}
      {!loading && error && (
        <div className="card glass-card text-center" style={{ padding: '3rem 2rem', border: '1px solid var(--danger-bg)' }}>
          <XCircle size={36} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--danger)' }}>Failed to load history</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{error}</p>
          <button onClick={fetchHistory} className="btn btn-outline btn-sm" style={{ margin: '0 auto' }}>
            Retry Loading
          </button>
        </div>
      )}

      {/* History List */}
      {!loading && !error && (
        <>
          {filteredAttempts.length === 0 ? (
            <div className="card glass-card text-center" style={{ padding: '4rem 2rem', background: 'var(--bg-secondary)' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.12)',
                color: 'var(--accent-indigo)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <HelpCircle size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>No test history found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: 450, margin: '0 auto 1.5rem' }}>
                {searchQuery || activeFilter !== 'all' 
                  ? 'No completed tests match your search criteria. Try clearing filters.' 
                  : 'You haven\'t completed any quizzes yet! Generate an AI quiz or pick one from the catalog.'}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <Link to="/ai-quiz" className="btn btn-gold">
                  <Sparkles size={16} /> Generate AI Quiz
                </Link>
                <Link to="/quizzes" className="btn btn-outline">
                  Browse Quizzes
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredAttempts.map((att, idx) => {
                const isPassed = att.percentage >= 70;
                const formattedDate = att.completedAt 
                  ? new Date(att.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : 'Recently';

                return (
                  <div key={att.attemptId || idx} className="card glass-card" style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                    flexWrap: 'wrap',
                    transition: 'all 0.2s ease',
                    borderLeft: `4px solid ${isPassed ? 'var(--success)' : 'var(--danger)'}`
                  }}>
                    {/* Left: Test Details */}
                    <div style={{ flex: '1 1 280px', minWidth: 260 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <span className={`badge ${getSourceBadgeClass(att.source)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                          {getSourceIcon(att.source)}
                          {att.source || 'AI Quiz'}
                        </span>
                        {att.category && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', background: 'var(--bg-secondary)', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
                            {att.category}
                          </span>
                        )}
                        {att.difficulty && (
                          <span className={`badge badge-${(att.difficulty || 'Medium').toLowerCase()}`} style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem' }}>
                            {att.difficulty}
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                        {att.quizTitle || 'Quiz Assessment'}
                      </h3>

                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={14} /> {formattedDate}
                        </span>
                        <span>
                          ⏱️ Duration: <strong>{Math.ceil((att.timeTakenSeconds || 0) / 60)} mins</strong>
                        </span>
                        <span>
                          📝 <strong>{att.totalQuestions || att.score} Questions</strong>
                        </span>
                      </div>
                    </div>

                    {/* Middle: Score Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isPassed ? 'var(--success)' : 'var(--danger)' }}>
                          {att.percentage}%
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                          Score: {att.score} / {att.totalQuestions}
                        </div>
                      </div>

                      {/* Status Tag */}
                      <span style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: isPassed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: isPassed ? 'var(--success)' : 'var(--danger)',
                        border: `1px solid ${isPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                      }}>
                        {isPassed ? '✓ Passed' : '✕ Practice Needed'}
                      </span>
                    </div>

                    {/* Right: View Result Action */}
                    <div>
                      <button
                        onClick={() => navigate(`/results/${att.attemptId}`)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: 'var(--radius-full)' }}
                      >
                        View Result <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage;

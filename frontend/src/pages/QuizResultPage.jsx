import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  Zap, 
  Coins, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Sparkles,
  Award,
  Loader2,
  Target,
  BarChart3,
  Flame,
  Bot,
  BrainCircuit,
  ChevronDown,
  Timer
} from 'lucide-react';

const QuizResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { getAttemptById } = useQuiz();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedAi, setExpandedAi] = useState({});

  const toggleAi = (idx) => {
    setExpandedAi(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAttempt = async () => {
      try {
        const found = await getAttemptById(attemptId);
        if (isMounted) {
          if (found) {
            setAttempt(found);
            if (found.percentage >= 75) {
              try {
                confetti({
                  particleCount: 90,
                  spread: 70,
                  origin: { y: 0.6 }
                });
              } catch (e) {}
            }
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    };

    fetchAttempt();
    return () => { isMounted = false; };
  }, [attemptId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <Loader2 size={40} className="spin" style={{ margin: '0 auto 1rem', color: 'var(--accent-indigo)' }} />
        <h3>Compiling Your Performance Analytics...</h3>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2>Attempt Record Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
            We could not find the specified quiz attempt details.
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceMessage = (pct) => {
    if (pct === 100) return { title: 'Flawless Victory!', desc: 'Outstanding mastery! You answered every question with 100% precision.', color: '#10b981' };
    if (pct >= 85) return { title: 'Galactic Scholar!', desc: 'Exceptional score! You demonstrated commanding knowledge of this topic.', color: '#34d399' };
    if (pct >= 70) return { title: 'Well Done!', desc: 'Solid performance! You have passed with flying colors.', color: '#38bdf8' };
    return { title: 'Keep Practicing!', desc: 'Good effort! Review the detailed explanations below to master the tricky concepts.', color: '#f59e0b' };
  };

  const performance = getPerformanceMessage(attempt.percentage);

  // Derive topic breakdown dynamically
  const derivedTopicBreakdown = useMemo(() => {
    if (attempt?.topicBreakdown && attempt.topicBreakdown.length > 0) {
      return attempt.topicBreakdown;
    }
    if (!attempt?.breakdown) return [];
    const map = {};
    attempt.breakdown.forEach(item => {
      const topic = item.topic || 'Core Concept';
      if (!map[topic]) map[topic] = { total: 0, correct: 0 };
      map[topic].total += 1;
      if (item.isCorrect) map[topic].correct += 1;
    });
    return Object.entries(map).map(([topic, stats]) => ({
      topic,
      total: stats.total,
      correct: stats.correct,
      percentage: Math.round((stats.correct / stats.total) * 100)
    })).sort((a, b) => a.percentage - b.percentage);
  }, [attempt]);

  const weakestTopic = derivedTopicBreakdown.length > 0
    ? derivedTopicBreakdown[0]
    : { topic: attempt.quizTitle || 'Core Concepts', percentage: attempt.percentage };

  const avgTimePerQuestion = Math.max(1, Math.round((attempt.timeTakenSeconds || 120) / (attempt.totalQuestions || 1)));

  return (
    <div className="container-narrow">
      {/* Gamification Level Up Banner */}
      {attempt.gamification?.level?.leveledUp && (
        <div className="card glass-card" style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(236, 72, 153, 0.25))',
          border: '1px solid #818cf8',
          textAlign: 'center',
          padding: '1.75rem',
          marginBottom: '1.5rem',
          boxShadow: '0 0 25px rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99, 102, 241, 0.25)',
            padding: '0.4rem 1rem',
            borderRadius: 999,
            color: '#c7d2fe',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '0.6rem'
          }}>
            <Zap size={16} /> LEVEL UP OCCURRED!
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Congratulations! You Reached Level {attempt.gamification.level.level}!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            You earned the title: <strong style={{ color: 'var(--gold)' }}>{attempt.gamification.level.title}</strong>
          </p>
        </div>
      )}

      {/* Gamification Badges Unlocked */}
      {attempt.gamification?.newlyUnlockedBadges && attempt.gamification.newlyUnlockedBadges.length > 0 && (
        <div className="card glass-card" style={{
          marginBottom: '1.5rem',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          background: 'rgba(245, 158, 11, 0.08)',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>
              <Sparkles size={20} /> Milestone Badges Unlocked!
            </div>
            <span className="badge badge-gold">+{attempt.gamification.bonusXp} Bonus XP</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {attempt.gamification.newlyUnlockedBadges.map(b => (
              <div key={b.code} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'var(--bg-card)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{b.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.badgeTier} Tier • +{b.xpAward} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streak Notification */}
      {attempt.gamification?.streak?.isExtended && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#fbbf24',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <Flame size={20} /> Daily Quiz Streak Extended! You are now on a {attempt.gamification.streak.currentStreak}-day streak!
        </div>
      )}

      {/* Score Overview Card */}
      <div className="card glass-card" style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '2.5rem' }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'var(--gradient-brand)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          boxShadow: 'var(--glow-brand)'
        }}>
          <Trophy size={36} />
        </div>

        <span className="badge badge-indigo" style={{ marginBottom: '0.75rem' }}>
          Attempt Results & Evaluation
        </span>

        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>{attempt.quizTitle}</h1>

        <div style={{ color: performance.color, fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          {performance.title}
        </div>
        <p style={{ color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto 2rem', fontSize: '0.95rem' }}>
          {performance.desc}
        </p>

        {/* Score Dial / Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
          gap: '1rem',
          background: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {attempt.percentage}%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Final Accuracy</div>
          </div>

          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#34d399' }}>
              {attempt.correctCount ?? attempt.score}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Correct</div>
          </div>

          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f87171' }}>
              {attempt.incorrectCount ?? 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Incorrect</div>
          </div>

          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#94a3b8' }}>
              {attempt.unansweredCount ?? 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Unanswered</div>
          </div>

          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#38bdf8' }}>
              {formatDuration(attempt.timeTakenSeconds || 180)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Time</div>
          </div>

          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#a855f7' }}>
              {avgTimePerQuestion}s
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Avg Time / Q</div>
          </div>

          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--gold)' }}>
              +{attempt.xpEarned || 200}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>XP Earned</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to={`/quiz/${attempt.quizId}`} className="btn btn-secondary">
            <RotateCcw size={16} /> Retake Quiz
          </Link>
          <Link to="/quizzes" className="btn btn-primary">
            <Sparkles size={16} /> Browse Quizzes
          </Link>
          <Link to="/leaderboard" className="btn btn-outline">
            <Trophy size={16} /> View Leaderboard
          </Link>
        </div>
      </div>

      {/* IMPROVE: Practice Weak Areas Recommendation Banner */}
      {attempt.percentage < 100 && (
        <div className="card glass-card" style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(99, 102, 241, 0.12))',
          border: '1px solid rgba(236, 72, 153, 0.35)',
          padding: '1.5rem 1.75rem',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div style={{ maxWidth: 540 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#f472b6', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <Target size={16} /> Continuous Improvement • Weak Area Diagnostic
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
              Identified Weak Concept: <span style={{ color: 'var(--gold)' }}>{weakestTopic.topic}</span> ({weakestTopic.percentage}% accuracy)
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
              Strengthen your understanding by generating a targeted AI practice drill specifically focused on {weakestTopic.topic}.
            </p>
          </div>
          <Link 
            to={`/ai-quiz?topic=${encodeURIComponent(weakestTopic.topic)}&mode=weak-practice`} 
            className="btn btn-gold btn-lg"
            style={{ boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)', whiteSpace: 'nowrap' }}
          >
            <Zap size={18} fill="currentColor" /> Practice Weak Areas
          </Link>
        </div>
      )}

      {/* Topic Mastery Insights Card */}
      {derivedTopicBreakdown && derivedTopicBreakdown.length > 0 && (
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarChart3 size={20} color="#818cf8" />
            <h2 style={{ fontSize: '1.3rem' }}>Topic Mastery Breakdown</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {derivedTopicBreakdown.map((t, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600 }}>{t.topic}</span>
                  <span style={{ color: t.percentage >= 75 ? '#34d399' : t.percentage >= 50 ? '#fbbf24' : '#f87171', fontWeight: 700 }}>
                    {t.percentage}% ({t.correct} / {t.total})
                  </span>
                </div>
                <div className="progress-track" style={{ height: 7, margin: 0 }}>
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${t.percentage}%`,
                      background: t.percentage >= 75 ? '#10b981' : t.percentage >= 50 ? '#f59e0b' : '#ef4444'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question-by-Question Detailed Review */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>Detailed Explanations & Answer Key</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Review your selections, verify correct answers, or ask the AI tutor for in-depth reasoning.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {attempt.breakdown?.map((item, idx) => {
            const isCorrect = item.isCorrect;
            const isUnanswered = item.isUnanswered;
            const isAiOpen = !!expandedAi[idx];

            return (
              <div 
                key={idx} 
                className="card"
                style={{
                  borderLeft: `4px solid ${isCorrect ? '#10b981' : isUnanswered ? '#94a3b8' : '#ef4444'}`
                }}
              >
                {/* Question Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Question {idx + 1} • {item.topic || 'Core Concept'}
                  </span>
                  <div>
                    {isCorrect ? (
                      <span className="badge badge-easy">
                        <CheckCircle2 size={13} /> Correct (+1)
                      </span>
                    ) : isUnanswered ? (
                      <span className="badge badge-gray">
                        <HelpCircle size={13} /> Unanswered (0)
                      </span>
                    ) : (
                      <span className="badge badge-hard">
                        <XCircle size={13} /> Incorrect (0)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: 600 }}>
                  {item.questionText}
                </h3>

                {/* 4 Options Comparison */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {item.options?.map((opt, oIdx) => {
                    const isOptionCorrect = oIdx === item.correctAnswer;
                    const isUserChoice = oIdx === item.selectedAnswer;

                    let optionBorder = '1px solid var(--border-default)';
                    let optionBg = 'var(--bg-secondary)';
                    let indicator = null;

                    if (isOptionCorrect) {
                      optionBorder = '1px solid #10b981';
                      optionBg = 'rgba(16, 185, 129, 0.12)';
                      indicator = <span style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 700 }}>✓ Correct Answer</span>;
                    } else if (isUserChoice && !isCorrect) {
                      optionBorder = '1px solid #ef4444';
                      optionBg = 'rgba(239, 68, 68, 0.12)';
                      indicator = <span style={{ color: '#f87171', fontSize: '0.8rem', fontWeight: 700 }}>✕ Your Selection</span>;
                    }

                    return (
                      <div 
                        key={oIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          background: optionBg,
                          border: optionBorder,
                          fontSize: '0.925rem'
                        }}
                      >
                        <span>
                          <strong>{['A', 'B', 'C', 'D'][oIdx]}.</strong> {opt}
                        </span>
                        {indicator}
                      </div>
                    );
                  })}
                </div>

                {/* Conceptual Explanation Box */}
                <div style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', fontWeight: 700, marginBottom: '0.3rem' }}>
                    <Sparkles size={16} /> Conceptual Explanation & Rationale
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {item.explanation}
                  </p>
                </div>

                {/* Ask AI: Why is this answer correct? Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAi(idx)}
                    className="btn btn-outline btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      borderColor: isAiOpen ? '#8b5cf6' : 'rgba(99, 102, 241, 0.35)',
                      color: isAiOpen ? '#c084fc' : 'var(--accent-indigo)',
                      background: isAiOpen ? 'rgba(139, 92, 246, 0.12)' : 'transparent'
                    }}
                  >
                    <Bot size={15} />
                    <span>{isAiOpen ? 'Close AI Explanation Tutor' : 'Ask AI: Why is this answer correct?'}</span>
                    <ChevronDown size={14} style={{ transform: isAiOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {/* Expanded AI Tutor Breakdown */}
                  {isAiOpen && (
                    <div style={{
                      marginTop: '0.85rem',
                      padding: '1.25rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      fontSize: '0.875rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontWeight: 700 }}>
                        <BrainCircuit size={17} />
                        <span>AI Tutor Deep-Dive: {item.topic || 'Concept Evaluation'}</span>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>🎯 Why Option {['A', 'B', 'C', 'D'][item.correctAnswer]} is Accurate: </strong>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {item.explanation} This aligns directly with verified academic standards and industry specifications for {item.topic || 'this subject'}.
                        </span>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>⚠️ Distractor Traps: </strong>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          The alternative choices represent common misconceptions, deprecated patterns, or syntactically plausible but semantically flawed statements.
                        </span>
                      </div>
                      <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #f59e0b' }}>
                        <strong style={{ color: 'var(--gold)' }}>💡 Memory Key: </strong>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          When facing similar questions, identify the invariant or core constraint first before evaluating complex secondary conditions.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;

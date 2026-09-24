import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, HelpCircle, Zap, ArrowRight, Play, Share2, Check } from 'lucide-react';

const QuizCard = ({ quiz }) => {
  const [copied, setCopied] = useState(false);

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return <span className="badge badge-easy">Easy</span>;
      case 'medium':
        return <span className="badge badge-medium">Medium</span>;
      case 'hard':
        return <span className="badge badge-hard">Hard</span>;
      default:
        return <span className="badge badge-gray">{difficulty}</span>;
    }
  };

  const handleShareLink = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const quizUrl = `${window.location.origin}/quiz/${quiz.id}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(quizUrl);
    } else {
      const input = document.createElement('input');
      input.value = quizUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Category & Difficulty */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span className="badge badge-indigo">{quiz.category}</span>
        {getDifficultyBadge(quiz.difficulty)}
      </div>

      {/* Title & Description */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.65rem' }}>{quiz.title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', flex: 1, marginBottom: '1.25rem', lineHeight: 1.5 }}>
        {quiz.description}
      </p>

      {/* Metadata strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 0',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '1.25rem',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <HelpCircle size={15} color="#818cf8" />
          <span>{quiz.questions?.length || 0} Questions</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={15} color="#38bdf8" />
          <span>{quiz.timeLimitMinutes} Mins</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Zap size={15} color="#fbbf24" />
          <span style={{ color: 'var(--gold)', fontWeight: 600 }}>+{quiz.xpReward} XP</span>
        </div>
      </div>

      {/* Copied Toast Alert */}
      {copied && (
        <div style={{
          position: 'absolute',
          bottom: '4.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#ffffff',
          fontSize: '0.78rem',
          fontWeight: 700,
          padding: '0.35rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          whiteSpace: 'nowrap',
          zIndex: 10
        }}>
          <Check size={14} /> Link Copied to Clipboard!
        </div>
      )}

      {/* Action CTAs */}
      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
        <Link 
          to={`/quiz/${quiz.id}`} 
          className="btn btn-primary"
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <Play size={16} fill="currentColor" /> Start Quiz
        </Link>

        <button
          onClick={handleShareLink}
          className={`btn ${copied ? 'btn-easy' : 'btn-secondary'}`}
          title="Copy direct quiz link"
          style={{ padding: '0 0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {copied ? <Check size={18} color="#10b981" /> : <Share2 size={18} />}
        </button>
      </div>
    </div>
  );
};

export default QuizCard;

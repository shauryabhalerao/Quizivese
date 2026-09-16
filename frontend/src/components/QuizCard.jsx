import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, HelpCircle, Zap, ArrowRight, Play } from 'lucide-react';

const QuizCard = ({ quiz }) => {
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

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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

      {/* Action CTA */}
      <Link 
        to={`/quiz/${quiz.id}`} 
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        <Play size={16} fill="currentColor" /> Start Quiz
      </Link>
    </div>
  );
};

export default QuizCard;

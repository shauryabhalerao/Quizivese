import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import Modal from './Modal';
import { KeyRound, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

const JoinCodeModal = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { quizzes } = useQuiz();
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    setError('');

    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError('Please enter a valid quiz code.');
      return;
    }

    // Match by quizCode, or id (case-insensitive)
    const match = quizzes.find(q => 
      (q.quizCode && q.quizCode.toUpperCase() === trimmed) ||
      (q.id && q.id.toUpperCase() === trimmed) ||
      (q.id && q.id.toUpperCase().includes(trimmed))
    );

    if (match) {
      onClose();
      navigate(`/quiz/${match.id}`);
    } else {
      setError(`No active quiz found matching code "${trimmed}". Please verify the code or browse the quiz library.`);
    }
  };

  const handleQuickSelect = (sampleCode) => {
    setCode(sampleCode);
    setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Quiz with Access Code"
    >
      <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: 0 }}>
          Enter the unique 4-7 character quiz code provided by your teacher, instructor, or organization.
        </p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={18} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Quiz Access Code
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex'
            }}>
              <KeyRound size={18} />
            </div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. WEB101, JS2026, DS301"
              maxLength={12}
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '2px solid var(--border-default)',
                color: 'var(--text-primary)',
                fontSize: '1.1rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
              autoFocus
            />
          </div>
        </div>

        {/* Quick Sample Codes Chips */}
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
            Active Classroom Codes:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['WEB101', 'PROG201', 'DS301', 'SQL101', 'CS501'].map(sample => (
              <button
                type="button"
                key={sample}
                onClick={() => handleQuickSelect(sample)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--accent-indigo)',
                  cursor: 'pointer'
                }}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>Start Quiz</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default JoinCodeModal;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  Play,
  Zap,
  CheckCircle2,
  ExternalLink,
  Layers,
  HelpCircle,
  Clock
} from 'lucide-react';

const ShareQuizModal = ({ isOpen, onClose, quiz }) => {
  const navigate = useNavigate();
  const [copiedQuizLink, setCopiedQuizLink] = useState(false);
  const [copiedArenaLink, setCopiedArenaLink] = useState(false);

  if (!quiz) return null;

  const quizId = quiz.id || 'quiz-1';
  const quizCode = (quiz.quizCode || quiz.code || quizId).toUpperCase();

  const quizUrl = `${window.location.origin}/quiz/${quizId}`;
  const arenaUrl = `${window.location.origin}/live?code=${quizCode}`;

  const copyToClipboard = (text, type) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    if (type === 'quiz') {
      setCopiedQuizLink(true);
      setTimeout(() => setCopiedQuizLink(false), 2200);
    } else {
      setCopiedArenaLink(true);
      setTimeout(() => setCopiedArenaLink(false), 2200);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quiz Published & Ready to Share" maxWidth={580}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(99, 102, 241, 0.15))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          width: 56,
          height: 56,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#10b981',
          margin: '0 auto 1rem',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)'
        }}>
          <CheckCircle2 size={30} />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          {quiz.title || 'Untitled Quiz'}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span className="badge badge-indigo">{quiz.category || 'General'}</span>
          <span>•</span>
          <span>{quiz.questions?.length || 0} Questions</span>
          <span>•</span>
          <span style={{ color: '#10b981', fontWeight: 600 }}>Saved in Database</span>
        </div>
      </div>

      {/* Share Section 1: Direct Quiz Link */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '1.1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Share2 size={16} color="var(--accent-indigo)" />
            Direct Quiz Access Link
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Share with students</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            readOnly
            value={quizUrl}
            className="form-input"
            style={{ fontSize: '0.85rem', fontFamily: 'monospace', background: 'var(--bg-card)' }}
            onClick={(e) => e.target.select()}
          />
          <button
            onClick={() => copyToClipboard(quizUrl, 'quiz')}
            className={`btn ${copiedQuizLink ? 'btn-easy' : 'btn-indigo'} btn-sm`}
            style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            {copiedQuizLink ? <Check size={16} /> : <Copy size={16} />}
            {copiedQuizLink ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        <button
          onClick={() => {
            onClose();
            navigate(`/quiz/${quizId}`);
          }}
          className="btn btn-outline btn-sm"
          style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
        >
          <Play size={14} fill="currentColor" /> Preview & Start Quiz Now
        </button>
      </div>

      {/* Share Section 2: Live Battle Arena Link */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(139, 92, 246, 0.08))',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '1.1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold)' }}>
            <Zap size={16} fill="currentColor" />
            Live Battle Arena Code & Link
          </div>
          <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Code: {quizCode}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            readOnly
            value={arenaUrl}
            className="form-input"
            style={{ fontSize: '0.85rem', fontFamily: 'monospace', background: 'var(--bg-card)' }}
            onClick={(e) => e.target.select()}
          />
          <button
            onClick={() => copyToClipboard(arenaUrl, 'arena')}
            className={`btn ${copiedArenaLink ? 'btn-easy' : 'btn-gold'} btn-sm`}
            style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            {copiedArenaLink ? <Check size={16} /> : <Copy size={16} />}
            {copiedArenaLink ? 'Copied!' : 'Copy Arena Link'}
          </button>
        </div>

        <button
          onClick={() => {
            onClose();
            navigate(`/live?code=${quizCode}`);
          }}
          className="btn btn-gold btn-sm"
          style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
        >
          <Zap size={14} fill="currentColor" /> Launch Live Arena Battle
        </button>
      </div>

      {/* Footer Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button
          onClick={() => {
            onClose();
            navigate('/quizzes');
          }}
          className="btn btn-primary"
        >
          Go to Quiz Library
        </button>
      </div>
    </Modal>
  );
};

export default ShareQuizModal;

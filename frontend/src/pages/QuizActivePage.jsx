import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import Modal from '../components/Modal';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  RotateCcw, 
  Send, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  Flame,
  Check,
  Loader2
} from 'lucide-react';

const QuizActivePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { getQuizById, recordAttempt } = useQuiz();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [reviewedFlags, setReviewedFlags] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef(null);

  // Load quiz asynchronously
  useEffect(() => {
    let isMounted = true;
    const loadQuiz = async () => {
      try {
        const found = await getQuizById(quizId);
        if (isMounted) {
          if (found) {
            setQuiz(found);
            setSecondsRemaining((found.timeLimitMinutes || 10) * 60);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    };
    loadQuiz();

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizId]);

  // Countdown timer hook
  useEffect(() => {
    if (!quiz || loading) return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [quiz, loading]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (secondsRemaining <= 60) return 'timer-pill timer-danger';
    if (secondsRemaining <= 180) return 'timer-pill timer-warning';
    return 'timer-pill timer-normal';
  };

  // Option selection
  const handleSelectOption = (optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  // Clear answer
  const handleClearAnswer = () => {
    setUserAnswers(prev => {
      const next = { ...prev };
      delete next[currentIndex];
      return next;
    });
  };

  // Toggle Mark for Review
  const handleToggleReview = () => {
    setReviewedFlags(prev => ({
      ...prev,
      [currentIndex]: !prev[currentIndex]
    }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < (quiz?.questions?.length || 1) - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Submission handler
  const handleFinalSubmit = async (forced = false) => {
    if (isSubmitting || !quiz) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpentSeconds = Math.max(1, (quiz.timeLimitMinutes * 60) - secondsRemaining);

    try {
      const attemptResult = await recordAttempt({
        quizId: quiz.id,
        answers: userAnswers,
        timeTakenSeconds: timeSpentSeconds
      });

      setIsSubmitModalOpen(false);

      if (attemptResult?.attemptId) {
        navigate(`/results/${attemptResult.attemptId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <Loader2 size={40} className="spin" style={{ margin: '0 auto 1rem', color: 'var(--accent-indigo)' }} />
        <h3>Loading Quiz Challenge...</h3>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2>Quiz Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
            The quiz you requested does not exist or has been retired.
          </p>
          <button onClick={() => navigate('/quizzes')} className="btn btn-primary">
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const reviewCount = Object.values(reviewedFlags).filter(Boolean).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="container">
      <div className="quiz-engine-wrapper">
        {/* Main Question Card */}
        <div className="quiz-main-card">
          {/* Header Bar */}
          <div className="quiz-header-bar">
            <div>
              <span className="badge badge-indigo" style={{ marginBottom: '0.4rem' }}>
                {quiz.title}
              </span>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Question <strong>{currentIndex + 1}</strong> of {totalQuestions} • Topic: <em>{currentQuestion?.topic || quiz.category}</em>
              </div>
            </div>

            {/* Timer */}
            <div className={getTimerClass()} title="Time remaining before auto-submit">
              <Clock size={18} />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>

          {/* Question Text */}
          <div className="question-text">
            {currentQuestion?.questionText}
          </div>

          {/* 4 Options */}
          <div className="options-container">
            {currentQuestion?.options?.map((optionText, optIdx) => {
              const isSelected = userAnswers[currentIndex] === optIdx;
              const optionLetter = ['A', 'B', 'C', 'D'][optIdx] || optIdx + 1;

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`option-btn ${isSelected ? 'selected' : ''}`}
                >
                  <span className="option-letter">{optionLetter}</span>
                  <span style={{ flex: 1 }}>{optionText}</span>
                  {isSelected && <Check size={18} color="#818cf8" />}
                </button>
              );
            })}
          </div>

          {/* Secondary Actions: Clear & Review */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={handleToggleReview}
              className={`btn btn-sm ${reviewedFlags[currentIndex] ? 'btn-gold' : 'btn-outline'}`}
            >
              <Bookmark size={15} fill={reviewedFlags[currentIndex] ? 'currentColor' : 'none'} />
              {reviewedFlags[currentIndex] ? 'Marked for Review' : 'Mark for Review'}
            </button>

            {userAnswers[currentIndex] !== undefined && (
              <button
                type="button"
                onClick={handleClearAnswer}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}
              >
                <RotateCcw size={14} /> Clear Selection
              </button>
            )}
          </div>

          {/* Navigation Bar */}
          <div className="quiz-actions-toolbar">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="btn btn-secondary"
            >
              <ChevronLeft size={18} /> Previous
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                >
                  Next Question <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="btn btn-gold"
                >
                  <Send size={16} /> Finish & Submit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="palette-sidebar">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Question Palette</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Click any question number to jump directly.
          </p>

          <div className="palette-grid">
            {questions.map((_, qIdx) => {
              const isAnswered = userAnswers[qIdx] !== undefined;
              const isReviewed = reviewedFlags[qIdx];
              const isCurrent = qIdx === currentIndex;

              let stateClass = 'unanswered';
              if (isReviewed) stateClass = 'reviewed';
              else if (isAnswered) stateClass = 'answered';

              return (
                <button
                  key={qIdx}
                  type="button"
                  onClick={() => setCurrentIndex(qIdx)}
                  className={`palette-btn ${stateClass} ${isCurrent ? 'active' : ''}`}
                >
                  {qIdx + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="palette-legend">
            <div className="legend-item">
              <span className="legend-indicator" style={{ background: 'rgba(16, 185, 129, 0.4)', border: '1px solid #10b981' }}></span>
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator" style={{ background: 'rgba(245, 158, 11, 0.4)', border: '1px solid #f59e0b' }}></span>
              <span>Marked for Review ({reviewCount})</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}></span>
              <span>Unanswered ({unansweredCount})</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator" style={{ border: '2px solid #a855f7', background: 'transparent' }}></span>
              <span>Current Question</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
          >
            <Send size={15} /> Submit Quiz Now
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Ready to Submit Quiz?"
        footer={
          <>
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="btn btn-secondary"
            >
              Continue Quiz
            </button>
            <button
              onClick={() => handleFinalSubmit(false)}
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Evaluating...' : 'Confirm Submission'}
            </button>
          </>
        }
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: unansweredCount > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: unansweredCount > 0 ? 'var(--gold)' : 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            {unansweredCount > 0 ? <AlertTriangle size={30} /> : <CheckCircle2 size={30} />}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {unansweredCount > 0
              ? `You still have ${unansweredCount} unanswered question(s). Are you sure you want to finalize your attempt?`
              : 'You have answered all questions. Answers cannot be changed after submission.'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          background: 'var(--bg-secondary)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>{answeredCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Answered</div>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171' }}>{unansweredCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unanswered</div>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>{reviewCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Under Review</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizActivePage;

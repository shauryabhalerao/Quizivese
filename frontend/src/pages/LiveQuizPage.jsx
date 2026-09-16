import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import confetti from 'canvas-confetti';
import {
  generateRoomCode,
  createLiveParticipantsRoster,
  defaultArenaQuestions,
  calculateQuestionScore,
  simulateBotRoundAnswers
} from '../services/liveQuizService';
import {
  Users,
  Trophy,
  Zap,
  Timer,
  Clock,
  Sparkles,
  Flame,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  Copy,
  CheckCircle2,
  Crown,
  Medal,
  Award,
  Play,
  Share2
} from 'lucide-react';

const STAGES = {
  LOBBY: 'LOBBY',
  COUNTDOWN: 'COUNTDOWN',
  QUESTION: 'QUESTION',
  ROUND_RESULTS: 'ROUND_RESULTS',
  PODIUM: 'PODIUM'
};

const LiveQuizPage = () => {
  const { currentUser } = useAuth();
  const { recordAttempt } = useQuiz();
  const navigate = useNavigate();

  // Arena State
  const [roomCode, setRoomCode] = useState(() => generateRoomCode());
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [stage, setStage] = useState(STAGES.LOBBY);
  const [participants, setParticipants] = useState(() => createLiveParticipantsRoster(currentUser, 104));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [countdownNum, setCountdownNum] = useState(3);
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liveAnsweredCount, setLiveAnsweredCount] = useState(0);

  const questionTimerRef = useRef(null);
  const roundAdvanceTimerRef = useRef(null);

  const currentQuestion = defaultArenaQuestions[currentQuestionIndex];
  const totalQuestions = defaultArenaQuestions.length;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
      if (roundAdvanceTimerRef.current) clearTimeout(roundAdvanceTimerRef.current);
    };
  }, []);

  // Handle Copy Room Code
  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  // Join existing code
  const handleJoinCode = (e) => {
    e.preventDefault();
    if (joinCodeInput.trim()) {
      setRoomCode(joinCodeInput.trim().toUpperCase());
      setJoinCodeInput('');
    }
  };

  // Start Arena Match Trigger
  const handleStartArena = () => {
    setStage(STAGES.COUNTDOWN);
    setCountdownNum(3);

    const countInterval = setInterval(() => {
      setCountdownNum(prev => {
        if (prev <= 1) {
          clearInterval(countInterval);
          startQuestionRound(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start a specific question round
  const startQuestionRound = (qIndex) => {
    setCurrentQuestionIndex(qIndex);
    setSelectedOption(null);
    setHasAnswered(false);
    setSecondsLeft(15);
    setLiveAnsweredCount(Math.floor(Math.random() * 10) + 12);
    setStage(STAGES.QUESTION);

    if (questionTimerRef.current) clearInterval(questionTimerRef.current);

    // Question Countdown Timer
    questionTimerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        // Increment simulated answered count
        setLiveAnsweredCount(curr => Math.min(104, curr + Math.floor(Math.random() * 9) + 4));

        if (prev <= 1) {
          clearInterval(questionTimerRef.current);
          handleTimeExpire(qIndex);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // User submits an answer during question stage
  const handleSelectOption = (optIdx) => {
    if (hasAnswered || stage !== STAGES.QUESTION) return;

    setSelectedOption(optIdx);
    setHasAnswered(true);

    const isCorrect = optIdx === currentQuestion.correctAnswer;
    const points = calculateQuestionScore(isCorrect, secondsLeft, 15);

    // Update user's score in participants roster
    setParticipants(prev =>
      prev.map(p => {
        if (p.isUser) {
          return {
            ...p,
            score: p.score + points,
            streak: isCorrect ? p.streak + 1 : 0,
            lastAnswerCorrect: isCorrect,
            pointsGained: points
          };
        }
        return p;
      })
    );
  };

  // Round time expired
  const handleTimeExpire = (qIndex) => {
    // 1. Simulate all bot round answers
    setParticipants(prev => {
      const updated = simulateBotRoundAnswers(prev, defaultArenaQuestions[qIndex].correctAnswer, 15);
      // Sort by score descending and re-assign ranks
      return updated
        .sort((a, b) => b.score - a.score)
        .map((p, idx) => ({ ...p, rank: idx + 1 }));
    });

    setStage(STAGES.ROUND_RESULTS);

    // 2. Advance to next question or podium after 4 seconds
    roundAdvanceTimerRef.current = setTimeout(() => {
      if (qIndex < totalQuestions - 1) {
        startQuestionRound(qIndex + 1);
      } else {
        finishArenaMatch();
      }
    }, 4500);
  };

  // Final Match Completion
  const finishArenaMatch = () => {
    setStage(STAGES.PODIUM);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // Sorted participants
  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);
  const userParticipant = participants.find(p => p.isUser) || sortedParticipants[0];

  return (
    <div className="container" style={{ maxWidth: 1020, padding: '2rem 1rem 5rem' }}>
      {/* ARENA STAGE: LOBBY */}
      {stage === STAGES.LOBBY && (
        <div>
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              color: 'var(--gold)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              <Zap size={16} fill="currentColor" /> Live Competitive Quiz Arena
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Arena Waiting Lobby</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 620, margin: '0.5rem auto 0' }}>
              Compete synchronously against 100+ simultaneous learners in 15-second rapid-fire rounds. 
              Speed and precision award maximum points!
            </p>
          </div>

          {/* Lobby Controller Card */}
          <div className="card glass-card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              {/* Room Code Badge */}
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Arena Access Code:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    color: 'var(--accent-indigo)',
                    background: 'var(--bg-secondary)',
                    padding: '0.35rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)'
                  }}>
                    {roomCode}
                  </span>
                  <button 
                    onClick={handleCopyCode} 
                    className="btn btn-secondary btn-sm"
                    title="Copy Room Code to share with peers"
                  >
                    {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Join another room code form */}
              <form onSubmit={handleJoinCode} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Enter Code (e.g. QVS912)"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  className="form-input"
                  style={{ width: 180, textTransform: 'uppercase' }}
                />
                <button type="submit" className="btn btn-outline btn-sm">
                  Switch Room
                </button>
              </form>

              {/* Start Match CTA */}
              <div>
                <button 
                  onClick={handleStartArena} 
                  className="btn btn-gold btn-lg"
                  style={{ padding: '0.85rem 2rem', boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)' }}
                >
                  <Play size={18} fill="currentColor" /> Start Arena Battle
                </button>
              </div>
            </div>

            {/* Participants Status Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem' }}>
                <Users size={20} color="#10b981" />
                <span>Active Participants in Lobby: <strong style={{ color: '#10b981' }}>{participants.length}</strong> / 150</span>
              </div>
              <span className="badge badge-easy" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                Synchronized & Connected
              </span>
            </div>

            {/* Player Avatars Grid (100+ players preview) */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '1rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              {participants.map((p, idx) => (
                <div
                  key={p.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: p.isUser ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-card)',
                    border: p.isUser ? '1px solid #818cf8' : '1px solid var(--border-default)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: p.isUser ? 700 : 500
                  }}
                >
                  <span style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: p.avatarBg,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700
                  }}>
                    {p.name.charAt(0)}
                  </span>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ARENA STAGE: COUNTDOWN */}
      {stage === STAGES.COUNTDOWN && (
        <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
          <div style={{
            fontSize: '6rem',
            fontWeight: 900,
            color: 'var(--gold)',
            animation: 'pulse 1s infinite',
            lineHeight: 1,
            marginBottom: '1.5rem'
          }}>
            {countdownNum}
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Arena Battle Starting...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Get ready! Rapid 15-second response round.</p>
        </div>
      )}

      {/* ARENA STAGE: ACTIVE QUESTION */}
      {stage === STAGES.QUESTION && (
        <div className="card glass-card" style={{ padding: '2.5rem 2rem' }}>
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span className="badge badge-indigo" style={{ marginBottom: '0.35rem' }}>
                Round {currentQuestionIndex + 1} of {totalQuestions} • {currentQuestion.topic}
              </span>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Arena: <strong>{roomCode}</strong> • {participants.length} Competitors
              </div>
            </div>

            {/* Synchronized Timer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: secondsLeft <= 4 ? '#ef4444' : secondsLeft <= 8 ? '#f59e0b' : '#38bdf8',
              background: 'var(--bg-secondary)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${secondsLeft <= 4 ? '#ef4444' : 'var(--border-default)'}`
            }}>
              <Timer size={20} />
              <span>{secondsLeft}s</span>
            </div>
          </div>

          {/* Animated Synchronized Progress Timer Bar */}
          <div className="progress-track" style={{ height: 10, marginBottom: '2rem' }}>
            <div 
              className="progress-fill" 
              style={{ 
                width: `${(secondsLeft / 15) * 100}%`,
                background: secondsLeft <= 4 ? '#ef4444' : secondsLeft <= 8 ? '#f59e0b' : 'var(--gradient-brand)',
                transition: 'width 1s linear'
              }}
            ></div>
          </div>

          {/* Question Text */}
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '2rem', lineHeight: 1.4 }}>
            {currentQuestion.questionText}
          </h2>

          {/* 4 Options Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {currentQuestion.options.map((opt, oIdx) => {
              const isSelected = selectedOption === oIdx;
              const optionLetter = ['A', 'B', 'C', 'D'][oIdx];

              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectOption(oIdx)}
                  disabled={hasAnswered}
                  className={`option-btn ${isSelected ? 'selected' : ''}`}
                  style={{
                    padding: '1.25rem 1.5rem',
                    textAlign: 'left',
                    opacity: hasAnswered && !isSelected ? 0.6 : 1,
                    cursor: hasAnswered ? 'default' : 'pointer'
                  }}
                >
                  <span className="option-letter">{optionLetter}</span>
                  <span style={{ flex: 1, fontSize: '0.975rem' }}>{opt}</span>
                  {isSelected && <Check size={18} color="#818cf8" />}
                </button>
              );
            })}
          </div>

          {/* Live Responses Indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div>
              {hasAnswered ? (
                <span style={{ color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={16} /> Answer Locked In! Waiting for round completion...
                </span>
              ) : (
                <span>Select an option before the timer reaches 0.</span>
              )}
            </div>
            <div>
              Live Responses: <strong>{liveAnsweredCount}</strong> / {participants.length}
            </div>
          </div>
        </div>
      )}

      {/* ARENA STAGE: ROUND RESULTS / LEADERBOARD STANDING */}
      {stage === STAGES.ROUND_RESULTS && (
        <div className="card glass-card" style={{ padding: '2.5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
              Round {currentQuestionIndex + 1} Complete
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Live Arena Standings</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Next question starting in 4 seconds...
            </p>
          </div>

          {/* Current User Standing Banner */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--accent-indigo)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--gradient-brand)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                #{userParticipant.rank}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{userParticipant.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Current Rank: <strong>#{userParticipant.rank}</strong> of {participants.length}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold)' }}>
                {userParticipant.score} pts
              </div>
              {userParticipant.pointsGained > 0 ? (
                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                  +{userParticipant.pointsGained} pts (Correct!)
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 700 }}>
                  +0 pts (Incorrect)
                </div>
              )}
            </div>
          </div>

          {/* Top 5 Leaderboard Standings */}
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Top Contenders in Room:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {sortedParticipants.slice(0, 5).map((p, idx) => (
              <div 
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.25rem',
                  background: p.isUser ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: p.isUser ? '1px solid #818cf8' : '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style={{ fontWeight: 800, width: 24, color: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#d97706' : 'inherit' }}>
                    #{idx + 1}
                  </span>
                  <span style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: p.avatarBg,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {p.name.charAt(0)}
                  </span>
                  <span style={{ fontWeight: p.isUser ? 700 : 500 }}>
                    {p.name} {p.isUser ? '(You)' : ''}
                  </span>
                </div>

                <div style={{ fontWeight: 800, color: 'var(--gold)' }}>
                  {p.score} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ARENA STAGE: PODIUM FINALE */}
      {stage === STAGES.PODIUM && (
        <div className="card glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--gradient-gold)',
            color: '#0c101c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: 'var(--glow-gold)'
          }}>
            <Trophy size={38} />
          </div>

          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            Arena Match Concluded
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Victory Podium
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 2.5rem' }}>
            Honoring the top scorers among {participants.length} simultaneous competitors!
          </p>

          {/* Podium Blocks (2nd, 1st, 3rd) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr 1fr',
            gap: '1rem',
            alignItems: 'flex-end',
            maxWidth: 620,
            margin: '0 auto 3rem'
          }}>
            {/* 2nd Place */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid #94a3b8',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 1rem 2rem',
              textAlign: 'center'
            }}>
              <Medal size={32} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#94a3b8' }}>2nd Place</div>
              <div style={{ fontWeight: 700, margin: '0.4rem 0' }}>{sortedParticipants[1]?.name}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--gold)', fontWeight: 800 }}>
                {sortedParticipants[1]?.score} pts
              </div>
            </div>

            {/* 1st Place Champion */}
            <div style={{
              background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.15) 0%, var(--bg-secondary) 100%)',
              border: '2px solid #f59e0b',
              borderRadius: 'var(--radius-xl)',
              padding: '2.25rem 1rem 2.75rem',
              textAlign: 'center',
              boxShadow: 'var(--glow-gold)'
            }}>
              <Crown size={42} color="#fbbf24" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#fbbf24' }}>CHAMPION</div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', margin: '0.4rem 0' }}>{sortedParticipants[0]?.name}</div>
              <div style={{ fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 900 }}>
                {sortedParticipants[0]?.score} pts
              </div>
            </div>

            {/* 3rd Place */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid #d97706',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1rem 1.75rem',
              textAlign: 'center'
            }}>
              <Award size={32} color="#d97706" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#d97706' }}>3rd Place</div>
              <div style={{ fontWeight: 700, margin: '0.4rem 0' }}>{sortedParticipants[2]?.name}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--gold)', fontWeight: 800 }}>
                {sortedParticipants[2]?.score} pts
              </div>
            </div>
          </div>

          {/* User's Final Standing Card */}
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            maxWidth: 450,
            margin: '0 auto 2.5rem',
            border: '1px solid var(--border-default)'
          }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your Final Placement:</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
              Rank #{userParticipant.rank} of {participants.length}
            </div>
            <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.95rem' }}>
              Total Score: {userParticipant.score} pts • +{Math.round(userParticipant.score / 4)} XP Awarded
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => {
                setRoomCode(generateRoomCode());
                setStage(STAGES.LOBBY);
                setParticipants(createLiveParticipantsRoster(currentUser, 104));
              }}
              className="btn btn-primary btn-lg"
            >
              <RotateCcw size={18} /> Play Another Match
            </button>
            <Link to="/quizzes" className="btn btn-outline btn-lg">
              Back to Quizzes
            </Link>
            <Link to="/leaderboard" className="btn btn-secondary btn-lg">
              <Trophy size={18} /> View Global Ranks
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveQuizPage;

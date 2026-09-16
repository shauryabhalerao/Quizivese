import React from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import QuizCard from '../components/QuizCard';
import { 
  Sparkles, 
  Bot, 
  Trophy, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  BrainCircuit,
  Timer
} from 'lucide-react';

const HomePage = () => {
  const { quizzes } = useQuiz();
  const { currentUser } = useAuth();
  const activeQuizzes = quizzes.filter(q => q.isActive).slice(0, 3);

  return (
    <div className="container">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 1rem 3.5rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          color: '#818cf8',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} /> Next-Generation AI Quiz & Assessment Platform
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
          Test Your Mastery in the <br />
          <span className="brand-gradient">AI-Powered Quiz Galaxy</span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: 720, margin: '0 auto 2.5rem' }}>
          Compete with 100+ students simultaneously, take timed interactive assessments, earn points, badges, and streaks, or generate customized exams on any subject using cutting-edge AI.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/quizzes" className="btn btn-primary btn-lg">
            <Zap size={18} fill="currentColor" /> Explore Quizzes
          </Link>
          <Link to="/ai-quiz" className="btn btn-gold btn-lg">
            <Bot size={18} /> Generate with AI
          </Link>
          <Link to="/leaderboard" className="btn btn-outline btn-lg">
            <Trophy size={18} /> View Leaderboard
          </Link>
        </div>
      </section>

      {/* Platform Highlight Metrics */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        margin: '2rem 0 4.5rem'
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>100+</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Concurrent Users</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <BrainCircuit size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>AI-Generated</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Smart Validations</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <Timer size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>Anti-Loss</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Live State Auto-Save</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <Flame size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>Gamified</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Streaks & XP Levels</div>
          </div>
        </div>
      </section>

      {/* Featured Quizzes */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>Featured Challenges</span>
            <h2 style={{ fontSize: '1.85rem' }}>Popular Quizzes in the Galaxy</h2>
          </div>
          <Link to="/quizzes" className="btn btn-outline btn-sm">
            View All ({quizzes.length}) <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {activeQuizzes.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </section>

      {/* How Quiziverse Works */}
      <section style={{ marginBottom: '5rem', background: 'var(--bg-card)', padding: '3.5rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-default)' }}>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 3rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>Workflow</span>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>How Quiziverse Works</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Master subjects quickly through continuous evaluation, instant feedback, and gamified progress.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'var(--gradient-brand)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontWeight: 800,
              fontSize: '1.25rem'
            }}>1</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Select or Generate</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Choose from verified computer science, coding, and science topics or prompt our AI engine for any subject.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontWeight: 800,
              fontSize: '1.25rem'
            }}>2</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Take the Timed Quiz</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Navigate seamlessly with our question palette, mark questions for review, and submit before the timer runs out.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'var(--gradient-gold)',
              color: '#0c101c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontWeight: 800,
              fontSize: '1.25rem'
            }}>3</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Climb the Leaderboard</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Inspect detailed answer explanations, unlock achievements, earn XP, and climb the Global & Weekly ranks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

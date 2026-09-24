import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  KeyRound,
  BrainCircuit,
  Timer,
  Code2,
  Binary,
  Calculator,
  Globe,
  Atom,
  Layout,
  Database,
  Cpu,
  Calendar,
  Star,
  Compass,
  Play,
  Award,
  BarChart3,
  Check,
  ChevronRight,
  Target,
  UploadCloud,
  Scan
} from 'lucide-react';

const categoriesList = [
  {
    name: "Programming",
    icon: Code2,
    color: "#6366f1",
    bgColor: "rgba(99, 102, 241, 0.12)",
    desc: "Object-oriented programming, memory paradigms & design patterns."
  },
  {
    name: "DSA",
    icon: Binary,
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.12)",
    desc: "Trees, graphs, search algorithms, sorting & Big-O time complexity."
  },
  {
    name: "Aptitude",
    icon: Calculator,
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.12)",
    desc: "Quantitative problem solving, probability, percentages & logic."
  },
  {
    name: "General Knowledge",
    icon: Globe,
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.12)",
    desc: "World geography, historical events, scientific milestones & trivia."
  },
  {
    name: "Science",
    icon: Atom,
    color: "#06b6d4",
    bgColor: "rgba(6, 182, 212, 0.12)",
    desc: "Physics, quantum concepts, chemistry & interstellar astronomy."
  },
  {
    name: "Artificial Intelligence",
    icon: BrainCircuit,
    color: "#ec4899",
    bgColor: "rgba(236, 72, 153, 0.12)",
    desc: "Transformers, neural networks, machine learning & LLM architectures."
  },
  {
    name: "Web Development",
    icon: Layout,
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.12)",
    desc: "HTML5 semantic markup, CSS3 Flexbox/Grid, React & RESTful APIs."
  },
  {
    name: "SQL",
    icon: Database,
    color: "#14b8a6",
    bgColor: "rgba(20, 184, 166, 0.12)",
    desc: "Relational queries, table JOINs, aggregations, indexing & ACID."
  },
  {
    name: "Computer Science",
    icon: Cpu,
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.12)",
    desc: "Operating systems, TCP/IP networks, concurrency & process scheduling."
  }
];

const HomePage = () => {
  const { quizzes } = useQuiz();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const safeQuizzes = Array.isArray(quizzes) ? quizzes : [];

  const [heroCode, setHeroCode] = useState('');
  const [heroCodeError, setHeroCodeError] = useState('');

  const handleHeroJoin = (e) => {
    e.preventDefault();
    setHeroCodeError('');
    const trimmed = heroCode.trim().toUpperCase();
    if (!trimmed) {
      setHeroCodeError('Please enter a valid quiz code.');
      return;
    }
    const match = safeQuizzes.find(q =>
      (q.quizCode && q.quizCode.toUpperCase() === trimmed) ||
      (q.id && q.id.toUpperCase() === trimmed) ||
      (q.id && q.id.toUpperCase().includes(trimmed))
    );
    if (match) {
      navigate(`/quiz/${match.id}`);
    } else {
      setHeroCodeError(`Quiz code "${trimmed}" not found. Try sample codes: WEB101, PROG201, or DS301.`);
    }
  };

  // Filter featured & popular quizzes
  const featuredQuizzes = safeQuizzes.filter(q => q && q.isFeatured && q.isActive).slice(0, 3);
  const popularQuizzes = safeQuizzes.filter(q => q && (q.isPopular || !q.isFeatured) && q.isActive).slice(0, 3);
  const dailyQuiz = safeQuizzes.find(q => q && q.isDaily && q.isActive) || safeQuizzes[0] || null;

  return (
    <div className="container">
      {/* 1. HERO SECTION */}
      <section style={{ textAlign: 'center', padding: '3.5rem 1rem 3rem', maxWidth: 960, margin: '0 auto' }}>
        {/* Tagline Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '0.45rem 1.15rem',
          borderRadius: 'var(--radius-full)',
          color: 'var(--accent-indigo)',
          fontSize: '0.9rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)'
        }}>
          <Sparkles size={16} />
          <span>Test. Analyze. Improve. • Next-Gen Quiz Platform</span>
        </div>

        {/* Main Heading with Brand Gradient */}
        <h1 style={{ 
          fontSize: 'clamp(2.4rem, 5.2vw, 3.8rem)', 
          fontWeight: 800, 
          letterSpacing: '-0.035em', 
          lineHeight: 1.18, 
          marginBottom: '1.25rem' 
        }}>
          Master Any Subject in the <br />
          <span className="brand-gradient">AI-Powered Quiz Galaxy</span>
        </h1>

        {/* Subtitle */}
        <p style={{ 
          fontSize: '1.15rem', 
          color: 'var(--text-secondary)', 
          lineHeight: 1.65, 
          marginBottom: '2.5rem', 
          maxWidth: 720, 
          margin: '0 auto 2.5rem' 
        }}>
          Take timed interactive quizzes, analyze your strengths and weak concepts with AI explanations, 
          compete with 100+ students in real-time arenas, and earn XP badges as you improve daily.
        </p>

        {/* Primary & Secondary CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Link to="/quizzes" className="btn btn-primary btn-lg" style={{ padding: '0.85rem 1.85rem' }}>
            <Play size={18} fill="currentColor" /> Start Quiz
          </Link>
          <a href="#categories" className="btn btn-outline btn-lg" style={{ padding: '0.85rem 1.85rem' }}>
            <Compass size={18} /> Explore Quizzes
          </a>
          <Link to="/ai-quiz?mode=upload" className="btn btn-gold btn-lg" style={{ padding: '0.85rem 1.85rem' }}>
            <UploadCloud size={18} /> AI Scan Notes / PDF
          </Link>
          <Link to="/live-quiz" className="btn btn-secondary btn-lg" style={{ padding: '0.85rem 1.5rem' }}>
            <Zap size={18} color="#f59e0b" fill="#f59e0b" /> Live Battle Arena
          </Link>
        </div>

        {/* Quick Quiz Code Join Bar */}
        <div style={{
          maxWidth: 540,
          margin: '0 auto 2.5rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.75rem 1rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <form onSubmit={handleHeroJoin} style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
            <div style={{ color: 'var(--accent-indigo)', display: 'flex' }}>
              <KeyRound size={20} />
            </div>
            <input
              type="text"
              value={heroCode}
              onChange={(e) => { setHeroCode(e.target.value.toUpperCase()); setHeroCodeError(''); }}
              placeholder="Have a Quiz Code? Enter here (e.g. WEB101)"
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.95rem',
                outline: 'none',
                letterSpacing: '0.05em'
              }}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 700, padding: '0.5rem 1rem' }}>
              Join Test
            </button>
          </form>
          {heroCodeError && (
            <div style={{ color: '#f87171', fontSize: '0.8rem', textAlign: 'left', marginTop: '0.5rem', paddingLeft: '1.75rem' }}>
              {heroCodeError}
            </div>
          )}
        </div>

        {/* Floating Trust Indicators */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Scan size={16} color="#06b6d4" /> AI PDF & Image Notes Scanning
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="#10b981" /> 100% Free & Open Access
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="#10b981" /> Pedagogical Explanations
          </span>
        </div>
      </section>

      {/* 2. PLATFORM HIGHLIGHT METRICS */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        margin: '1.5rem 0 4.5rem'
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>100+</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Simultaneous Arena Players</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <BrainCircuit size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>Smart AI</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Personalized Diagnostics</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <Timer size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>Anti-Loss</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Live State Auto-Save</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <Flame size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>Gamified</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Streaks, Badges & XP</div>
          </div>
        </div>
      </section>

      {/* 3. DAILY QUIZ SPOTLIGHT CARD */}
      {dailyQuiz && (
        <section style={{ marginBottom: '4.5rem' }}>
          <div className="card glass-card" style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            padding: '2rem 2.25rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              <div style={{ maxWidth: 640 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={14} /> Daily Quiz Challenge
                  </span>
                  <span className="badge badge-indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Zap size={14} /> +350 Bonus XP
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Flame size={15} /> 2x Streak Multiplier
                  </span>
                </div>

                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  {dailyQuiz.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
                  {dailyQuiz.description}
                </p>
                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Category: <strong>{dailyQuiz.category}</strong></span>
                  <span>Questions: <strong>{dailyQuiz.questions?.length || 5}</strong></span>
                  <span>Time Limit: <strong>{dailyQuiz.timeLimitMinutes} Mins</strong></span>
                </div>
              </div>

              <div>
                <Link 
                  to={`/quiz/${dailyQuiz.id}`} 
                  className="btn btn-gold btn-lg"
                  style={{ padding: '0.85rem 1.75rem', boxShadow: '0 4px 18px rgba(245, 158, 11, 0.3)' }}
                >
                  <Play size={18} fill="currentColor" /> Take Daily Quiz
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. QUIZ CATEGORIES GRID (9 Curated Subjects) */}
      <section id="categories" style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 2.5rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>Curated Disciplines</span>
          <h2 style={{ fontSize: '2.1rem', marginBottom: '0.65rem' }}>Explore Quiz Categories</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Choose from 9 structured subject areas designed for university coursework, tech interviews, and competitive examinations.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '1.25rem'
        }}>
          {categoriesList.map(cat => {
            const Icon = cat.icon;
            const categoryQuizCount = safeQuizzes.filter(q => q && q.category === cat.name && q.isActive).length;

            return (
              <div 
                key={cat.name}
                onClick={() => navigate(`/quizzes?category=${encodeURIComponent(cat.name)}`)}
                className="card card-hover"
                style={{ 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  padding: '1.5rem',
                  transition: 'all var(--transition-normal)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: 46,
                    height: 46,
                    borderRadius: 'var(--radius-md)',
                    background: cat.bgColor,
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} />
                  </div>
                  <span className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
                    {categoryQuizCount > 0 ? `${categoryQuizCount} Quizzes` : 'Practice Ready'}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>{cat.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: 1.45 }}>
                    {cat.desc}
                  </p>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 4, 
                  color: cat.color, 
                  fontSize: '0.85rem', 
                  fontWeight: 600,
                  marginTop: 'auto',
                  paddingTop: '0.5rem'
                }}>
                  <span>Browse Category</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FEATURED QUIZZES */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>Featured Challenges</span>
            <h2 style={{ fontSize: '1.9rem' }}>Featured Quizzes in the Galaxy</h2>
          </div>
          <Link to="/quizzes" className="btn btn-outline btn-sm">
            View All ({safeQuizzes.length}) <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '1.5rem'
        }}>
          {featuredQuizzes.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </section>

      {/* 6. POPULAR QUIZZES */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Student Favorites</span>
            <h2 style={{ fontSize: '1.9rem' }}>Popular Quizzes</h2>
          </div>
          <Link to="/quizzes" className="btn btn-outline btn-sm">
            Browse All Quizzes <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '1.5rem'
        }}>
          {popularQuizzes.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </section>

      {/* 7. HOW QUIZIVERSE WORKS (Test -> Analyze -> Improve) */}
      <section style={{ 
        marginBottom: '5rem', 
        background: 'var(--bg-card)', 
        padding: '3.75rem 2rem', 
        borderRadius: 'var(--radius-xl)', 
        border: '1px solid var(--border-default)' 
      }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 3rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>The Mastery Engine</span>
          <h2 style={{ fontSize: '2.1rem', marginBottom: '0.75rem' }}>How Quiziverse Works</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Built around a proven continuous learning methodology: <strong>Test</strong> your knowledge, <strong>Analyze</strong> exact mistakes, and <strong>Improve</strong> targeting weak concepts.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '2rem'
        }}>
          {/* Step 1: Test */}
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--gradient-brand)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontWeight: 800,
              fontSize: '1.35rem',
              boxShadow: 'var(--glow-brand)'
            }}>1</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>1. Test</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              Choose curated assessments across 9 disciplines, join 100+ player live arenas, or prompt the AI engine for custom questions up to 50 items.
            </p>
          </div>

          {/* Step 2: Analyze */}
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontWeight: 800,
              fontSize: '1.35rem',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
            }}>2</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>2. Analyze</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              Get instant performance analytics with topic mastery progress bars, time-per-question metrics, and interactive <em>"Ask AI"</em> answer rationales.
            </p>
          </div>

          {/* Step 3: Improve */}
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--gradient-gold)',
              color: '#0c101c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontWeight: 800,
              fontSize: '1.35rem',
              boxShadow: 'var(--glow-gold)'
            }}>3</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>3. Improve</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              Click <strong>"Practice Weak Areas"</strong> to target low-scoring concepts, maintain daily streaks, unlock tier badges, and climb global standings.
            </p>
          </div>
        </div>
      </section>

      {/* 8. GAMIFICATION & REWARD PREVIEW */}
      <section style={{ marginBottom: '5rem' }}>
        <div className="card glass-card" style={{ padding: '3rem 2.5rem', border: '1px solid var(--border-default)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.65rem' }}>
                <Trophy size={14} /> Gamification & Progression
              </span>
              <h2 style={{ fontSize: '2.1rem', marginBottom: '1rem', fontWeight: 800 }}>
                Level Up As You Learn
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Quiziverse transforms study sessions into an engaging progression system. Every question answered correctly earns XP, reinforces daily streaks, and unlocks milestone badges.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={16} />
                  </div>
                  <span style={{ fontSize: '0.95rem' }}><strong>XP & Tier Levels:</strong> Rise from <em>Apprentice Initiate</em> to <em>Grandmaster</em>.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Flame size={16} />
                  </div>
                  <span style={{ fontSize: '0.95rem' }}><strong>Daily Streaks:</strong> Complete at least 1 quiz daily to preserve your streak multiplier.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={16} />
                  </div>
                  <span style={{ fontSize: '0.95rem' }}><strong>Badge Showcase:</strong> Collect Bronze, Silver, Gold, and Platinum achievements.</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <Link to="/achievements" className="btn btn-primary">
                  <Award size={17} /> View All Badges
                </Link>
              </div>
            </div>

            {/* Badges Preview Mock Visual */}
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Student Badge Milestones</span>
                <span className="badge badge-gold">4/6 Unlocked</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Perfectionist</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score 100% on any quiz • Gold Tier</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Relentless Explorer</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Maintain a 7-day daily quiz streak • Platinum</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Sharpshooter</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score 90%+ on any hard quiz • Gold Tier</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. AI-POWERED LEARNING PREVIEW */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          maxWidth: 900,
          margin: '0 auto'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(236, 72, 153, 0.12)',
            color: '#ec4899',
            padding: '0.4rem 1rem',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            <Bot size={16} /> Intelligent Synthesis
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Scan Syllabus, Notes & Images into Quizzes
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 640, margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Upload your course syllabus PDF, lecture slides, or photos of textbook chapters. Our multimodal AI scans the material, identifies core learning objectives, and synthesizes verified single-choice assessments instantly.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/ai-quiz?mode=upload" className="btn btn-gold btn-lg">
              <UploadCloud size={18} /> Upload & Scan Syllabus (PDF / Images)
            </Link>
            <Link to="/create-quiz" className="btn btn-secondary btn-lg">
              Manual Quiz Builder Studio
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FINAL BOTTOM CALL TO ACTION */}
      <section style={{ textAlign: 'center', padding: '2rem 1rem 4rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Ready to Test Your Knowledge?
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '1rem' }}>
          Join thousands of learners challenging themselves in the Quiziverse Galaxy.
        </p>
        <Link to="/quizzes" className="btn btn-primary btn-lg" style={{ padding: '0.9rem 2.25rem', fontSize: '1.1rem' }}>
          <Play size={18} fill="currentColor" /> Start Quiz Now
        </Link>
      </section>
    </div>
  );
};

export default HomePage;

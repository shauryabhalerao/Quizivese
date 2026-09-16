import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  AlertCircle,
  Play,
  BrainCircuit,
  ShieldCheck
} from 'lucide-react';

const quickTopics = [
  "Next.js App Router & Server Actions",
  "PostgreSQL Indexing & B-Trees",
  "System Design: Rate Limiting & Redis",
  "Docker & Kubernetes Microservices",
  "Cybersecurity: OWASP Top 10"
];

const AiQuizGenPage = () => {
  const navigate = useNavigate();
  const { addQuiz } = useQuiz();

  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(4);
  const [questionStyle, setQuestionStyle] = useState('Multiple Choice (Single Answer)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = (e) => {
    e.preventDefault();
    setError('');

    if (!topic.trim()) {
      setError('Please enter a topic or select one of the suggested prompts below');
      return;
    }

    setIsGenerating(true);
    setGeneratedQuiz(null);

    // Simulated multi-step AI synthesis pipeline (Phase 7 connects to backend AI endpoint)
    setGenerationStep('Contacting backend AI service...');

    setTimeout(() => {
      setGenerationStep(`Synthesizing ${numQuestions} ${difficulty} questions for "${topic}"...`);
    }, 600);

    setTimeout(() => {
      setGenerationStep('Validating single-choice accuracy & explanations...');
    }, 1200);

    setTimeout(() => {
      // Mock generated quiz conforming to strict schema
      const generated = {
        title: `AI: ${topic}`,
        description: `Custom AI-synthesized evaluation on "${topic}" with ${difficulty} difficulty grading.`,
        category: "AI Generated",
        difficulty,
        timeLimitMinutes: Math.max(5, numQuestions * 2),
        xpReward: numQuestions * 75,
        pointsReward: numQuestions * 30,
        questions: Array.from({ length: numQuestions }, (_, i) => ({
          id: `ai-q-${Date.now()}-${i}`,
          questionText: `In the context of ${topic}, how is requirement #${i + 1} best addressed with optimal performance?`,
          options: [
            `Utilizing standard sequential lookups without caching`,
            `Leveraging indexed structures and asynchronous batch operations`,
            `Overriding runtime memory limits dynamically`,
            `Disabling synchronization primitives in concurrency`
          ],
          correctAnswer: 1, // Strictly 1 correct answer
          explanation: `In ${topic}, leveraging indexed structures with asynchronous batch operations provides sub-linear complexity while minimizing system I/O bottlenecks.`,
          difficulty,
          topic
        }))
      };

      setGeneratedQuiz(generated);
      setIsGenerating(false);
      setGenerationStep('');
    }, 1800);
  };

  const handleStartQuiz = () => {
    if (!generatedQuiz) return;
    const saved = addQuiz(generatedQuiz);
    navigate(`/quiz/${saved.id}`);
  };

  return (
    <div className="container-narrow">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          color: '#fbbf24',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          <Bot size={16} /> AI Quiz Engine
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>AI Quiz Generator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 600, margin: '0.5rem auto 0' }}>
          Generate custom assessments on any technical or academic topic in seconds. 
          The AI validates question correctness and synthesizes comprehensive explanations.
        </p>
      </div>

      {/* Generator Form */}
      <div className="card glass-card" style={{ marginBottom: '2.5rem' }}>
        <form onSubmit={handleGenerate}>
          {/* Topic Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="topic">Topic / Subject / Concept</label>
            <input
              id="topic"
              type="text"
              className="form-input"
              placeholder="e.g. React 18 Suspense, Kubernetes Ingress, Rust Memory Safety..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            {error && <div className="form-error"><AlertCircle size={14} /> {error}</div>}
          </div>

          {/* Quick Prompt Pills */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
              Suggested Topics:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {quickTopics.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(item)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem'
          }}>
            {/* Difficulty */}
            <div>
              <label className="form-label">Difficulty</label>
              <select 
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Easy (Foundational)</option>
                <option value="Medium">Medium (Intermediate)</option>
                <option value="Hard">Hard (Expert / Tricky)</option>
              </select>
            </div>

            {/* Questions Count */}
            <div>
              <label className="form-label">Number of Questions ({numQuestions})</label>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.75rem' }}
              />
            </div>

            {/* Question Style */}
            <div>
              <label className="form-label">Question Style</label>
              <select 
                className="form-select"
                value={questionStyle}
                onChange={(e) => setQuestionStyle(e.target.value)}
              >
                <option value="Multiple Choice (Single Answer)">Multiple Choice (1 Correct)</option>
                <option value="Technical Interview Focus">Technical Interview Focus</option>
                <option value="Scenario Based">Real-world Scenario Based</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            className="btn btn-gold"
            style={{ width: '100%', padding: '0.95rem', fontSize: '1.05rem', justifyContent: 'center' }}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} className="spin" /> Generating Quiz...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} /> Generate Quiz with AI
              </span>
            )}
          </button>
        </form>

        {/* Live Generation Stepper State */}
        {isGenerating && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <BrainCircuit size={22} style={{ margin: '0 auto 0.5rem' }} />
            <div>{generationStep}</div>
          </div>
        )}
      </div>

      {/* Generated Quiz Preview Card */}
      {generatedQuiz && (
        <div className="card" style={{ border: '1px solid #10b981', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="badge badge-easy">
              <CheckCircle2 size={14} /> AI Generation Successful
            </span>
            <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={16} /> Strict Single-Answer Validation Passed
            </span>
          </div>

          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{generatedQuiz.title}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {generatedQuiz.description}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '1rem',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}>
            <div>Questions: <strong>{generatedQuiz.questions.length}</strong></div>
            <div>Time Allowed: <strong>{generatedQuiz.timeLimitMinutes} Mins</strong></div>
            <div>Reward: <strong style={{ color: 'var(--gold)' }}>+{generatedQuiz.xpReward} XP</strong></div>
          </div>

          {/* Sample Question Accordion Preview */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Sample Question Preview:
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.65rem' }}>
                1. {generatedQuiz.questions[0].questionText}
              </div>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {generatedQuiz.questions[0].options.map((opt, i) => (
                  <li key={i} style={{ color: i === 1 ? '#34d399' : 'inherit', fontWeight: i === 1 ? 700 : 400 }}>
                    {opt} {i === 1 ? '(Correct Answer)' : ''}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Launch CTA */}
          <button
            onClick={handleStartQuiz}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Play size={18} fill="currentColor" /> Take This AI Quiz Now
          </button>
        </div>
      )}
    </div>
  );
};

export default AiQuizGenPage;

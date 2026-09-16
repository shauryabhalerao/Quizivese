import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  Sparkles, 
  GraduationCap, 
  School,
  ArrowRight,
  Send
} from 'lucide-react';

const defaultCategories = [
  'Science & Biology',
  'Mathematics & Logic',
  'History & Social Studies',
  'Literature & Language',
  'Computer Science & IT',
  'Economics & Business',
  'Arts & Music',
  'General Knowledge',
  'Custom Subject'
];

const gradeLevels = [
  'Elementary School (K-5)',
  'Middle School (6-8)',
  'High School (9-12)',
  'College / Undergraduate',
  'Graduate / Professional',
  'General Audience / Open to All'
];

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const { addQuiz } = useQuiz();
  const { currentUser } = useAuth();

  // Quiz Level Metadata
  const [title, setTitle] = useState('');
  const [categorySelection, setCategorySelection] = useState('Science & Biology');
  const [customCategory, setCustomCategory] = useState('');
  const [gradeLevel, setGradeLevel] = useState('General Audience / Open to All');
  const [difficulty, setDifficulty] = useState('Medium');
  const [description, setDescription] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [autoCalculateTime, setAutoCalculateTime] = useState(true);

  // Questions Array (Up to 50)
  const [questions, setQuestions] = useState([
    {
      id: `q-manual-1`,
      questionText: '',
      topic: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }
  ]);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to resolve effective category
  const effectiveCategory = categorySelection === 'Custom Subject'
    ? (customCategory.trim() || 'Custom Subject')
    : categorySelection;

  // Auto-adjust time limit based on question count
  const handleQuestionCountChange = (newCount) => {
    if (autoCalculateTime) {
      setTimeLimitMinutes(Math.min(180, Math.max(5, Math.ceil(newCount * 1.5))));
    }
  };

  // Add a new blank question (Max 50)
  const handleAddQuestion = () => {
    if (questions.length >= 50) {
      setError('A maximum of 50 questions is supported per quiz.');
      return;
    }
    setError('');
    const nextList = [
      ...questions,
      {
        id: `q-manual-${Date.now()}-${questions.length}`,
        questionText: '',
        topic: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }
    ];
    setQuestions(nextList);
    handleQuestionCountChange(nextList.length);
  };

  // Remove question
  const handleRemoveQuestion = (idx) => {
    if (questions.length <= 1) {
      setError('Quiz must contain at least 1 question.');
      return;
    }
    setError('');
    const nextList = questions.filter((_, i) => i !== idx);
    setQuestions(nextList);
    handleQuestionCountChange(nextList.length);
  };

  // Update question text / subtopic / explanation / correct answer
  const handleQuestionChange = (idx, field, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  // Update specific option text
  const handleOptionChange = (qIdx, optIdx, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      const nextOptions = [...updated[qIdx].options];
      nextOptions[optIdx] = value;
      updated[qIdx] = { ...updated[qIdx], options: nextOptions };
      return updated;
    });
  };

  // Load a quick starter template for teachers
  const handleLoadTemplate = () => {
    setTitle('General Science & Environmental Systems');
    setCategorySelection('Science & Biology');
    setGradeLevel('High School (9-12)');
    setDifficulty('Medium');
    setDescription('Comprehensive evaluation testing core foundational concepts in cellular biology, ecosystems, and earth sciences.');
    setQuestions([
      {
        id: `q-manual-t1`,
        questionText: 'What is the primary function of chlorophyll in plant cells?',
        topic: 'Plant Biology',
        options: [
          'Absorbing sunlight energy to drive photosynthesis',
          'Breaking down glucose into glycogen',
          'Absorbing nitrogen directly from deep groundwater',
          'Transporting lipids through the cell wall'
        ],
        correctAnswer: 0,
        explanation: 'Chlorophyll is the green pigment in chloroplasts that absorbs light energy (predominantly blue and red wavelengths) to fuel photosynthesis.'
      },
      {
        id: `q-manual-t2`,
        questionText: 'Which layer of Earth\'s atmosphere contains the protective ozone layer?',
        topic: 'Atmospheric Science',
        options: [
          'Troposphere',
          'Stratosphere',
          'Mesosphere',
          'Thermosphere'
        ],
        correctAnswer: 1,
        explanation: 'The ozone layer is primarily situated in the stratosphere, where it absorbs harmful ultraviolet (UV) radiation from the Sun.'
      },
      {
        id: `q-manual-t3`,
        questionText: 'What type of symbiotic relationship benefits one organism while the other is neither helped nor harmed?',
        topic: 'Ecology',
        options: [
          'Mutualism',
          'Parasitism',
          'Commensalism',
          'Competition'
        ],
        correctAnswer: 2,
        explanation: 'Commensalism is a relationship where one species benefits (e.g. remoras riding on sharks) while the other remains essentially unaffected.'
      }
    ]);
    setTimeLimitMinutes(10);
    setError('');
  };

  // Submit and Publish Quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a quiz title.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (categorySelection === 'Custom Subject' && !customCategory.trim()) {
      setError('Please enter your custom subject / category.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validate all questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question #${i + 1} prompt cannot be empty.`);
        return;
      }
      for (let o = 0; o < 4; o++) {
        if (!q.options[o].trim()) {
          setError(`Question #${i + 1} has an empty option (Option ${['A', 'B', 'C', 'D'][o]}). All 4 choices are required.`);
          return;
        }
      }
      if (q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer > 3) {
        setError(`Question #${i + 1} must have a designated correct answer choice.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const quizPayload = {
        title: title.trim(),
        description: description.trim() || `Open educational assessment on "${title.trim()}" created for ${gradeLevel}.`,
        category: effectiveCategory,
        difficulty,
        timeLimitMinutes: Number(timeLimitMinutes) || 15,
        targetGrade: gradeLevel,
        createdBy: currentUser?.name || 'Educator',
        authorRole: currentUser?.role || 'teacher',
        xpReward: questions.length * 75,
        pointsReward: questions.length * 30,
        questions: questions.map((q, idx) => ({
          ...q,
          topic: q.topic.trim() || effectiveCategory,
          order_index: idx
        }))
      };

      const created = await addQuiz(quizPayload);
      setIsSubmitting(false);

      if (created?.id) {
        navigate(`/quiz/${created.id}`);
      } else {
        navigate('/quizzes');
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to publish quiz. Please verify inputs.');
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            color: 'var(--accent-indigo)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <School size={16} /> Open for Teachers, Schools & Creators
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Create a Quiz Studio</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 750 }}>
            Author custom assessments on <strong>any subject or topic</strong> with up to 50 questions, single-choice verification, and pedagogical explanations for students.
          </p>
        </div>

        <button 
          type="button" 
          onClick={handleLoadTemplate}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Sparkles size={15} style={{ color: 'var(--gold)' }} /> Load Example Template
        </button>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'var(--danger-bg)',
          border: '1px solid var(--danger)',
          color: 'var(--danger)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.75rem',
          fontWeight: 500
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Quiz Details */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--accent-indigo)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9rem'
            }}>
              1
            </div>
            <h2 style={{ fontSize: '1.35rem' }}>Quiz Overview & Target Topic</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* Title */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Quiz Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AP Biology: Cellular Respiration, 8th Grade World History, French Vocabulary..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category / Subject */}
            <div className="form-group">
              <label className="form-label">Subject / Category *</label>
              <select
                className="form-select"
                value={categorySelection}
                onChange={(e) => setCategorySelection(e.target.value)}
              >
                {defaultCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Custom Category Input if selected */}
            {categorySelection === 'Custom Subject' && (
              <div className="form-group">
                <label className="form-label">Enter Custom Subject Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Marine Robotics, Sanskrit, Accounting..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Target Audience / Grade */}
            <div className="form-group">
              <label className="form-label">School / Grade Level</label>
              <select
                className="form-select"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
              >
                {gradeLevels.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <select
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Easy (Beginner / Introductory)</option>
                <option value="Medium">Medium (Standard Curriculum)</option>
                <option value="Hard">Hard (Advanced / Honors)</option>
              </select>
            </div>

            {/* Time Limit */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Time Limit (Minutes)</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ~1.5 min per question
                </span>
              </div>
              <input
                type="number"
                min="1"
                max="180"
                className="form-input"
                value={timeLimitMinutes}
                onChange={(e) => {
                  setTimeLimitMinutes(Math.max(1, parseInt(e.target.value, 10) || 5));
                  setAutoCalculateTime(false);
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description & Instructions for Students</label>
            <textarea
              className="form-input"
              rows="2"
              placeholder="Provide context, guidelines, or instructions for students taking this assessment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Step 2: Questions Builder */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--gold)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem'
              }}>
                2
              </div>
              <h2 style={{ fontSize: '1.35rem' }}>
                Questions Builder 
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--text-muted)', 
                  fontWeight: 500,
                  marginLeft: '0.75rem',
                  background: 'var(--bg-secondary)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)'
                }}>
                  {questions.length} / 50 Questions
                </span>
              </h2>
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              disabled={questions.length >= 50}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={16} /> Add Question
            </button>
          </div>

          {/* Questions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {questions.map((q, qIdx) => (
              <div 
                key={q.id || qIdx} 
                className="card" 
                style={{ 
                  padding: '1.5rem', 
                  borderLeft: '4px solid var(--accent-indigo)',
                  position: 'relative'
                }}
              >
                {/* Header of Question */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      background: 'var(--accent-indigo)',
                      color: '#fff',
                      padding: '0.2rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      Question #{qIdx + 1}
                    </span>

                    <input
                      type="text"
                      className="form-input"
                      placeholder="Subtopic Tag (e.g. Photosynthesis, Algebra...)"
                      value={q.topic}
                      onChange={(e) => handleQuestionChange(qIdx, 'topic', e.target.value)}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', width: '220px' }}
                    />
                  </div>

                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="btn btn-sm btn-outline"
                      style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.3rem 0.6rem' }}
                      title="Delete Question"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  )}
                </div>

                {/* Question Prompt */}
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontSize: '0.9rem' }}>
                    Question Prompt / Problem Statement *
                  </label>
                  <textarea
                    className="form-input"
                    rows="2"
                    placeholder="Type the question or scenario clearly..."
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                    required
                  />
                </div>

                {/* 4 Options Grid */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <label className="form-label" style={{ fontSize: '0.85rem', margin: 0 }}>
                      Answer Options (Click radio button to designate the <strong>Correct Answer</strong>) *
                    </label>
                    <span style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 600 }}>
                      Selected: Choice {['A', 'B', 'C', 'D'][q.correctAnswer]}
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '0.75rem'
                  }}>
                    {['A', 'B', 'C', 'D'].map((letter, optIdx) => {
                      const isCorrect = q.correctAnswer === optIdx;
                      return (
                        <div 
                          key={letter}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-secondary)',
                            border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--border-default)'}`,
                            borderRadius: 'var(--radius-md)',
                            padding: '0.65rem 0.85rem',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <input
                            type="radio"
                            name={`correct-${qIdx}`}
                            checked={isCorrect}
                            onChange={() => handleQuestionChange(qIdx, 'correctAnswer', optIdx)}
                            id={`q-${qIdx}-opt-${optIdx}`}
                            style={{ width: '17px', height: '17px', accentColor: '#10b981', cursor: 'pointer' }}
                          />
                          <label 
                            htmlFor={`q-${qIdx}-opt-${optIdx}`}
                            style={{ 
                              fontWeight: 700, 
                              color: isCorrect ? 'var(--success)' : 'var(--text-muted)',
                              cursor: 'pointer',
                              minWidth: '18px'
                            }}
                          >
                            {letter}:
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder={`Option ${letter} choice text...`}
                            value={q.options[optIdx]}
                            onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              padding: '0.2rem',
                              boxShadow: 'none',
                              color: 'var(--text-primary)'
                            }}
                            required
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pedagogical Explanation */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <BookOpen size={14} style={{ color: 'var(--accent-cyan)' }} />
                    Conceptual Explanation / Rationale for Students (Revealed post-test)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Explain why the selected option is correct and dispel misconceptions..."
                    value={q.explanation}
                    onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Another Question Button */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={handleAddQuestion}
              disabled={questions.length >= 50}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.75rem', gap: '0.5rem' }}
            >
              <Plus size={18} /> Add Next Question ({questions.length + 1}/50)
            </button>
          </div>
        </div>

        {/* Step 3: Sticky Publish Footer Bar */}
        <div style={{
          position: 'sticky',
          bottom: '1rem',
          zIndex: 40,
          background: 'var(--bg-glass-card)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem 2rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={18} style={{ color: 'var(--gold)' }} />
              <span><strong>{questions.length}</strong> Questions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span><strong>{timeLimitMinutes}</strong> Minutes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={18} style={{ color: 'var(--accent-pink)' }} />
              <span><strong>+{questions.length * 75}</strong> XP Reward</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => navigate('/quizzes')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-gold"
              disabled={isSubmitting}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 170, justifyContent: 'center' }}
            >
              <Send size={16} />
              {isSubmitting ? 'Publishing...' : 'Publish & Share Quiz'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateQuizPage;

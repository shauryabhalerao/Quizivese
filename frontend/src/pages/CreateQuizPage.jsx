import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import ShareQuizModal from '../components/ShareQuizModal';
import {
  Sparkles,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
  Zap,
  ArrowRight,
  ShieldAlert,
  Copy,
  Info
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

const createBlankQuestion = (id) => ({
  id: id || `q-manual-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
  type: 'multiple-choice',
  questionText: '',
  topic: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  marks: 1,
  explanation: ''
});

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addQuiz } = useQuiz();
  const { currentUser } = useAuth();

  // Quiz Level Metadata
  const [title, setTitle] = useState('');
  const [quizCode, setQuizCode] = useState(() => 'QUIZ' + Math.floor(100 + Math.random() * 900));
  const [categorySelection, setCategorySelection] = useState('Science & Biology');
  const [customCategory, setCustomCategory] = useState('');
  const [gradeLevel, setGradeLevel] = useState('General Audience / Open to All');
  const [difficulty, setDifficulty] = useState('Medium');
  const [description, setDescription] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [autoCalculateTime, setAutoCalculateTime] = useState(true);
  const [negativeMarking, setNegativeMarking] = useState('0');

  // Share Modal State
  const [createdQuizForShare, setCreatedQuizForShare] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Questions Array (Up to 100)
  const [questions, setQuestions] = useState([
    createBlankQuestion('q-manual-1')
  ]);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If redirected from AI Scanner with imported questions, populate form
  useEffect(() => {
    if (location.state?.importedQuiz) {
      const imported = location.state.importedQuiz;
      if (imported.title) setTitle(imported.title);
      if (imported.description) setDescription(imported.description);
      if (imported.category) {
        if (defaultCategories.includes(imported.category)) {
          setCategorySelection(imported.category);
        } else {
          setCategorySelection('Custom Subject');
          setCustomCategory(imported.category);
        }
      }
      if (imported.difficulty) setDifficulty(imported.difficulty);
      if (imported.timeLimitMinutes) setTimeLimitMinutes(imported.timeLimitMinutes);
      if (imported.questions && imported.questions.length > 0) {
        setQuestions(imported.questions.map((q, idx) => ({
          id: q.id || `q-imported-${Date.now()}-${idx}`,
          type: q.type || 'multiple-choice',
          questionText: q.questionText || '',
          topic: q.topic || imported.title || '',
          options: q.options || ['', '', '', ''],
          correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
          marks: q.marks || 1,
          explanation: q.explanation || ''
        })));
      }
    }
  }, [location.state]);

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

  // Adjust total questions to a specific target count (1-100)
  const handleSetTargetCount = (target) => {
    const parsed = parseInt(target, 10);
    if (isNaN(parsed)) return;

    if (parsed < 1 || parsed > 100) {
      setError('Number of questions must be an integer between 1 and 100.');
      return;
    }

    setError('');
    const currentCount = questions.length;

    if (parsed === currentCount) return;

    if (parsed > currentCount) {
      // Append blank questions up to target
      const additions = [];
      for (let i = currentCount; i < parsed; i++) {
        additions.push(createBlankQuestion(`q-manual-${Date.now()}-${i}`));
      }
      const updated = [...questions, ...additions];
      setQuestions(updated);
      handleQuestionCountChange(updated.length);
    } else {
      // Trim to target
      const updated = questions.slice(0, parsed);
      setQuestions(updated);
      handleQuestionCountChange(updated.length);
    }
  };

  // Add a single blank question (Max 100)
  const handleAddQuestion = () => {
    if (questions.length >= 100) {
      setError('A maximum of 100 questions is supported per quiz.');
      return;
    }
    setError('');
    const nextList = [
      ...questions,
      createBlankQuestion(`q-manual-${Date.now()}-${questions.length}`)
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

  // Update question text / subtopic / explanation / correct answer / marks
  const handleQuestionChange = (idx, field, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  // Change question type between multiple-choice and true-false
  const handleQuestionTypeChange = (idx, newType) => {
    setQuestions(prev => {
      const updated = [...prev];
      if (newType === 'true-false') {
        updated[idx] = {
          ...updated[idx],
          type: 'true-false',
          options: ['True', 'False'],
          correctAnswer: updated[idx].correctAnswer > 1 ? 0 : updated[idx].correctAnswer
        };
      } else {
        updated[idx] = {
          ...updated[idx],
          type: 'multiple-choice',
          options: ['', '', '', '']
        };
      }
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
    setQuizCode('SCI202');
    setCategorySelection('Science & Biology');
    setGradeLevel('High School (9-12)');
    setDifficulty('Medium');
    setDescription('Comprehensive evaluation testing core foundational concepts in cellular biology, ecosystems, and earth sciences.');
    setQuestions([
      {
        id: `q-manual-t1`,
        type: 'multiple-choice',
        marks: 1,
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
        type: 'multiple-choice',
        marks: 1,
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
        type: 'multiple-choice',
        marks: 1,
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
    setNegativeMarking('0');
    setError('');
  };

  // Total possible marks
  const totalPossibleMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 1), 0);

  // Submit and Publish Quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a quiz title.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!quizCode.trim()) {
      setError('Please provide a unique Quiz Code for student access.');
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
      const optionCount = q.type === 'true-false' ? 2 : 4;
      for (let o = 0; o < optionCount; o++) {
        if (!q.options[o] || !q.options[o].trim()) {
          setError(`Question #${i + 1} has an empty option (Option ${['A', 'B', 'C', 'D'][o]}). All choices are required.`);
          return;
        }
      }
      if (q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer >= optionCount) {
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
        quizCode: quizCode.trim().toUpperCase(),
        negativeMarking: Number(negativeMarking) || 0,
        totalMarks: totalPossibleMarks,
        createdBy: currentUser?.name || 'Educator',
        authorRole: currentUser?.role || 'teacher',
        xpReward: questions.length * 75,
        pointsReward: questions.length * 30,
        questions: questions.map((q, idx) => ({
          ...q,
          marks: Number(q.marks) || 1,
          type: q.type || 'multiple-choice',
          options: q.type === 'true-false' ? q.options.slice(0, 2) : q.options,
          topic: q.topic.trim() || effectiveCategory,
          order_index: idx
        }))
      };

      const created = await addQuiz(quizPayload);
      setIsSubmitting(false);

      if (created) {
        setCreatedQuizForShare(created);
        setIsShareModalOpen(true);
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

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link 
            to="/ai-quiz?mode=upload"
            className="btn btn-gold btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <UploadCloud size={15} /> AI Scan Syllabus / PDF
          </Link>

          <button 
            type="button" 
            onClick={handleLoadTemplate}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Sparkles size={15} style={{ color: 'var(--gold)' }} /> Load Example Template
          </button>
        </div>
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

            {/* Quiz Access Code */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Hash size={15} style={{ color: 'var(--accent-indigo)' }} /> Quiz Join Code *
                </label>
                <button
                  type="button"
                  onClick={() => setQuizCode('QUIZ' + Math.floor(100 + Math.random() * 900))}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.15rem 0.5rem', fontSize: '0.75rem' }}
                >
                  Generate
                </button>
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. BIO101, MATH20, EXAM1"
                value={quizCode}
                onChange={(e) => setQuizCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                required
                style={{ letterSpacing: '0.08em', fontWeight: 700 }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Share this code with students to let them join immediately.
              </span>
            </div>

            {/* Negative Marking Scheme */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldAlert size={15} style={{ color: 'var(--danger)' }} /> Negative Marking Penalty
              </label>
              <select
                className="form-select"
                value={negativeMarking}
                onChange={(e) => setNegativeMarking(e.target.value)}
              >
                <option value="0">None (0 Penalty - Standard)</option>
                <option value="0.25">-0.25 Marks per wrong answer (1/4 penalty)</option>
                <option value="0.33">-0.33 Marks per wrong answer (1/3 penalty)</option>
                <option value="0.5">-0.50 Marks per wrong answer</option>
                <option value="1">-1.00 Mark per wrong answer</option>
              </select>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Deducted only for incorrect answers; skipped questions have 0 penalty.
              </span>
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
                  {questions.length} / 100 Questions
                </span>
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Question count presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: 2 }}>Quick Count:</span>
                {[5, 10, 20, 30, 50].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => handleSetTargetCount(cnt)}
                    className={`btn btn-sm ${questions.length === cnt ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem' }}
                  >
                    {cnt}
                  </button>
                ))}
              </div>

              {/* Flexible Number Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target:</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={questions.length}
                  onChange={(e) => handleSetTargetCount(e.target.value)}
                  className="form-input"
                  style={{ width: 68, padding: '0.3rem 0.5rem', textAlign: 'center', fontSize: '0.85rem' }}
                  title="Enter exact number of questions (1-100)"
                />
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                disabled={questions.length >= 100}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Plus size={16} /> Add Question
              </button>
            </div>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
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

                    {/* Question Type selector */}
                    <select
                      className="form-select"
                      value={q.type || 'multiple-choice'}
                      onChange={(e) => handleQuestionTypeChange(qIdx, e.target.value)}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: '150px' }}
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True / False</option>
                    </select>

                    {/* Per-question Marks */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Marks:</span>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        className="form-input"
                        value={q.marks || 1}
                        onChange={(e) => handleQuestionChange(qIdx, 'marks', Math.max(1, parseInt(e.target.value, 10) || 1))}
                        style={{ width: '55px', padding: '0.25rem 0.4rem', fontSize: '0.85rem', textAlign: 'center' }}
                      />
                    </div>

                    <input
                      type="text"
                      className="form-input"
                      placeholder="Subtopic Tag (e.g. Photosynthesis, Algebra...)"
                      value={q.topic}
                      onChange={(e) => handleQuestionChange(qIdx, 'topic', e.target.value)}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', width: '200px' }}
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
                    placeholder={q.type === 'true-false' ? "State a proposition (e.g. The mitochondria is known as the powerhouse of the cell)..." : "Type the question or scenario clearly..."}
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                    required
                  />
                </div>

                {/* Options Grid */}
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
                      Selected Correct: Choice {['A', 'B', 'C', 'D'][q.correctAnswer]} ({q.options[q.correctAnswer] || 'Option'})
                    </span>
                  </div>

                  {q.type === 'true-false' ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.75rem'
                    }}>
                      {[
                        { letter: 'A', text: 'True', val: 0 },
                        { letter: 'B', text: 'False', val: 1 }
                      ].map(tf => {
                        const isCorrect = q.correctAnswer === tf.val;
                        return (
                          <div 
                            key={tf.text}
                            onClick={() => {
                              handleQuestionChange(qIdx, 'correctAnswer', tf.val);
                              const opts = [...q.options];
                              opts[0] = 'True';
                              opts[1] = 'False';
                              handleQuestionChange(qIdx, 'options', opts);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
                              border: `1.5px solid ${isCorrect ? 'var(--success)' : 'var(--border-default)'}`,
                              borderRadius: 'var(--radius-md)',
                              padding: '0.85rem 1.25rem',
                              cursor: 'pointer',
                              transition: 'all var(--transition-fast)'
                            }}
                          >
                            <input
                              type="radio"
                              name={`correct-${qIdx}`}
                              checked={isCorrect}
                              onChange={() => handleQuestionChange(qIdx, 'correctAnswer', tf.val)}
                              id={`q-${qIdx}-opt-${tf.val}`}
                              style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                            />
                            <label 
                              htmlFor={`q-${qIdx}-opt-${tf.val}`}
                              style={{ 
                                fontWeight: 700, 
                                fontSize: '1rem',
                                color: isCorrect ? 'var(--success)' : 'var(--text-primary)',
                                cursor: 'pointer'
                              }}
                            >
                              Option {tf.letter}: {tf.text}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
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
                              value={q.options[optIdx] || ''}
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
                  )}
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
              disabled={questions.length >= 100}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.75rem', gap: '0.5rem' }}
            >
              <Plus size={18} /> Add Next Question ({questions.length + 1}/100)
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
              <Target size={18} style={{ color: 'var(--accent-indigo)' }} />
              <span><strong>{totalPossibleMarks}</strong> Total Marks</span>
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

      {/* Share Quiz Modal */}
      <ShareQuizModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        quiz={createdQuizForShare}
      />
    </div>
  );
};

export default CreateQuizPage;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { api } from '../services/api';
import ShareQuizModal from '../components/ShareQuizModal';
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
  ShieldCheck,
  FileText,
  Target,
  UploadCloud,
  File,
  Image as ImageIcon,
  Trash2,
  X,
  Scan,
  RefreshCw,
  Edit3,
  Clock,
  Award,
  Info,
  Share2
} from 'lucide-react';

const quickTopics = [
  "Next.js App Router & Server Actions",
  "PostgreSQL Indexing & B-Trees",
  "System Design: Rate Limiting & Redis",
  "Docker & Kubernetes Microservices",
  "Cybersecurity: OWASP Top 10"
];

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const AiQuizGenPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get('topic') || '';
  const modeParam = searchParams.get('mode') || '';

  const { addQuiz } = useQuiz();
  const fileInputRef = useRef(null);

  // Tab: 'upload' (Syllabus, PDF & Images) | 'prompt' (Topic Prompt) | 'notes' (Paste Raw Text)
  const [activeTab, setActiveTab] = useState(
    modeParam === 'upload' || modeParam === 'notes' ? modeParam : 'prompt'
  );

  const [topic, setTopic] = useState(topicParam);
  const [rawNotes, setRawNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const [difficulty, setDifficulty] = useState(modeParam === 'weak-practice' ? 'Medium' : 'Medium');
  const [numQuestions, setNumQuestions] = useState(modeParam === 'weak-practice' ? 5 : 5);
  const [questionStyle, setQuestionStyle] = useState('Multiple Choice (Single Answer)');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [aiStatus, setAiStatus] = useState(null);

  useEffect(() => {
    if (topicParam) {
      setTopic(topicParam);
    }
  }, [topicParam]);

  // Check AI Status on page load
  useEffect(() => {
    api.get('/ai/status')
      .then(res => {
        if (res?.data) {
          setAiStatus(res.data);
        }
      })
      .catch(err => {
        console.warn('[AI STATUS CHECK]: Could not reach backend status endpoint:', err.message);
      });
  }, []);

  // Clean up object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(f => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
    };
  }, [uploadedFiles]);

  // Handle Drag & Drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  // Add files to state with validation
  const handleFilesAdded = (newFiles) => {
    setError('');
    setErrorDetails('');
    const valid = [];

    for (const f of newFiles) {
      const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
      const isImg = f.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(f.name);
      const isTxt = f.type === 'text/plain' || f.name.toLowerCase().endsWith('.txt') || f.name.toLowerCase().endsWith('.md');

      if (!isPdf && !isImg && !isTxt) {
        setError(`File "${f.name}" has an unsupported format. Please upload PDF documents, textbook/notes photos (PNG, JPG, WEBP), or text files.`);
        continue;
      }

      if (f.size > 10 * 1024 * 1024) {
        setError(`File "${f.name}" exceeds the 10MB maximum size limit.`);
        continue;
      }

      // Attach temporary thumbnail preview for images
      if (isImg) {
        f.previewUrl = URL.createObjectURL(f);
      }
      f.isPdf = isPdf;
      f.isImg = isImg;
      f.isTxt = isTxt;

      valid.push(f);
    }

    if (uploadedFiles.length + valid.length > 10) {
      setError('You can upload a maximum of 10 files simultaneously.');
      return;
    }

    const merged = [...uploadedFiles, ...valid];
    setUploadedFiles(merged);

    // Auto-detect topic heading from first file if user hasn't typed one
    if (!topic.trim() && merged.length > 0) {
      const cleanName = merged[0].name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      setTopic(cleanName);
    }
  };

  const handleRemoveFile = (idxToRemove) => {
    const file = uploadedFiles[idxToRemove];
    if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
    setUploadedFiles(prev => prev.filter((_, i) => i !== idxToRemove));
  };

  const handleClearAllFiles = () => {
    uploadedFiles.forEach(f => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setUploadedFiles([]);
  };

  // Main Generation Handler
  const handleGenerate = async (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    setError('');
    setErrorDetails('');

    // Determine effective topic title
    let effectiveTopic = topic.trim();
    if (!effectiveTopic) {
      if (activeTab === 'upload' && uploadedFiles.length > 0) {
        effectiveTopic = uploadedFiles[0].name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
      } else if (activeTab === 'notes' && rawNotes.trim()) {
        effectiveTopic = 'Study Notes Assessment';
      } else {
        setError('Please enter a topic, select a prompt, or upload your syllabus/notes.');
        return;
      }
    }

    const count = Math.min(Math.max(1, parseInt(numQuestions, 10) || 5), 50);

    setIsGenerating(true);
    setGeneratedQuiz(null);
    setGenerationStep('Connecting to Gemini AI synthesis engine...');

    try {
      // 1. Multimodal file / notes upload path (if files or raw notes exist)
      if ((activeTab === 'upload' && uploadedFiles.length > 0) || (activeTab === 'notes' && rawNotes.trim())) {
        const formData = new FormData();
        uploadedFiles.forEach(f => {
          formData.append('files', f);
        });
        formData.append('notesText', rawNotes.trim());
        formData.append('topic', effectiveTopic);
        formData.append('difficulty', difficulty);
        formData.append('numberOfQuestions', count);
        formData.append('questionType', questionStyle);
        formData.append('category', 'Study Material');

        setGenerationStep(`Scanning study content & synthesizing ${count} ${difficulty} questions...`);
        const res = await api.post('/ai/upload-and-generate', formData);

        if (res?.data?.quiz) {
          setGeneratedQuiz(res.data.quiz);
          setIsGenerating(false);
          setGenerationStep('');
          return;
        } else {
          throw new Error('Backend returned an invalid response format.');
        }
      } else {
        // 2. Standard topic prompt path
        setGenerationStep(`Synthesizing ${count} ${difficulty} questions for "${effectiveTopic}" via Gemini...`);
        const res = await api.post('/ai/generate', {
          topic: effectiveTopic,
          difficulty,
          numberOfQuestions: count,
          numQuestions: count,
          questionCount: count,
          questionStyle
        });

        if (res?.data?.quiz) {
          setGeneratedQuiz(res.data.quiz);
          setIsGenerating(false);
          setGenerationStep('');
          return;
        } else {
          throw new Error('Backend returned an invalid response format.');
        }
      }
    } catch (err) {
      console.error('[AI QUIZ GENERATION ERROR]:', err);
      setIsGenerating(false);
      setGenerationStep('');
      setGeneratedQuiz(null);

      const serverMessage = err.message || 'AI quiz generation failed.';
      setError(serverMessage);
      if (err.details) {
        setErrorDetails(typeof err.details === 'string' ? err.details : JSON.stringify(err.details));
      }
    }
  };

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [savedQuizForShare, setSavedQuizForShare] = useState(null);

  const handleStartQuiz = async () => {
    if (!generatedQuiz) return;
    const saved = await addQuiz(generatedQuiz);
    if (saved && saved.id) {
      navigate(`/quiz/${saved.id}`);
    } else if (generatedQuiz.id) {
      navigate(`/quiz/${generatedQuiz.id}`);
    }
  };

  const handleShareQuiz = async () => {
    if (!generatedQuiz) return;
    const saved = await addQuiz(generatedQuiz);
    const targetQuiz = saved || generatedQuiz;
    setSavedQuizForShare(targetQuiz);
    setIsShareModalOpen(true);
  };

  const handleOpenInStudio = () => {
    if (!generatedQuiz) return;
    navigate('/create-quiz', { state: { importedQuiz: generatedQuiz } });
  };

  return (
    <div className="container-narrow" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          color: 'var(--accent-indigo)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          <Sparkles size={16} /> Multimodal AI Scanner & Generator
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          AI Quiz Generator
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 640, margin: '0.5rem auto 0', lineHeight: 1.6 }}>
          Generate authentic, academically verified quizzes on any topic or upload your <strong>Syllabus PDF</strong>, <strong>lecture notes</strong>, or <strong>textbook photos</strong>.
        </p>
      </div>

      {/* AI Configuration Status Notice if unconfigured */}
      {aiStatus && !aiStatus.configured && (
        <div className="card glass-card" style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertCircle size={22} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--danger)' }}>Backend Gemini API Key Unconfigured:</strong> Please set <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>GEMINI_API_KEY=your_key</code> in <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>backend/.env</code> to enable live AI generation.
          </div>
        </div>
      )}

      {/* Weak Area Diagnostic Mode Alert if redirected */}
      {modeParam === 'weak-practice' && topicParam && (
        <div className="card glass-card" style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(236, 72, 153, 0.12))',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Target size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>
              Targeted Weak Area Diagnostic Mode Active
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Synthesizing targeted practice focusing specifically on <strong>"{topicParam}"</strong> to rapidly build conceptual mastery.
            </div>
          </div>
        </div>
      )}

      {/* 3 Mode Switcher Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        background: 'var(--bg-secondary)',
        padding: '0.4rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`btn btn-sm ${activeTab === 'upload' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ flex: 1, minWidth: '200px', justifyContent: 'center', gap: '0.5rem', fontWeight: 700 }}
        >
          <UploadCloud size={16} /> Upload Syllabus, PDF & Images
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('prompt')}
          className={`btn btn-sm ${activeTab === 'prompt' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ flex: 1, minWidth: '170px', justifyContent: 'center', gap: '0.5rem' }}
        >
          <BrainCircuit size={16} /> By Topic Prompt
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          className={`btn btn-sm ${activeTab === 'notes' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ flex: 1, minWidth: '170px', justifyContent: 'center', gap: '0.5rem' }}
        >
          <FileText size={16} /> Paste Raw Notes Text
        </button>
      </div>

      {/* Main Generator Form Card */}
      <div className="card glass-card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.75rem',
            color: 'var(--text-primary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <AlertCircle size={22} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '1rem', marginBottom: '0.35rem' }}>
                  AI Quiz Generation Failed
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                  {error}
                </div>

                {errorDetails && (
                  <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.75rem', borderRadius: 4, fontFamily: 'monospace', color: '#fca5a5', marginBottom: '0.65rem', wordBreak: 'break-word' }}>
                    {errorDetails}
                  </div>
                )}

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', borderTop: '1px dashed rgba(239,68,68,0.3)', paddingTop: '0.5rem' }}>
                  <strong>Troubleshooting Checklist:</strong>
                  <ul style={{ margin: '0.25rem 0 0 1.25rem', padding: 0 }}>
                    <li>Ensure <code style={{ color: 'var(--gold)' }}>GEMINI_API_KEY</code> is set in <code style={{ color: 'var(--gold)' }}>backend/.env</code>.</li>
                    <li>Verify configured Gemini model (<code style={{ color: 'var(--gold)' }}>{aiStatus?.model || 'gemini-2.5-flash'}</code>) is accessible with your API key.</li>
                    <li>Ensure Quiziverse backend server is running on port 5001.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleGenerate}>
          {/* TAB 1: UPLOAD SYLLABUS, PDF & IMAGES */}
          {activeTab === 'upload' && (
            <div style={{ marginBottom: '1.75rem' }}>
              {/* Drag and Drop Zone */}
              <div
                className={`file-dropzone ${isDragging ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      handleFilesAdded(Array.from(e.target.files));
                    }
                    e.target.value = '';
                  }}
                  multiple
                  accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,.txt,.md"
                  style={{ display: 'none' }}
                />

                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: 'var(--accent-indigo)'
                }}>
                  <UploadCloud size={30} />
                </div>

                <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  Drag & Drop Syllabus PDF, Textbook Excerpts, or Notes Photos
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Supports <strong>PDF documents</strong>, <strong>PNG/JPG/WEBP photos</strong>, and text files (up to 10MB each, max 10 files)
                </div>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ pointerEvents: 'none' }}
                >
                  <FileText size={15} /> Browse Files on Computer
                </button>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Selected Files ({uploadedFiles.length} / 10):
                    </span>
                    <button
                      type="button"
                      onClick={handleClearAllFiles}
                      className="btn btn-sm btn-ghost"
                      style={{ color: 'var(--danger)', fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="file-upload-list">
                    {uploadedFiles.map((file, idx) => (
                      <div key={`${file.name}-${idx}`} className="file-upload-card">
                        {file.isImg && file.previewUrl ? (
                          <img src={file.previewUrl} alt={file.name} className="file-thumb-preview" />
                        ) : (
                          <div className={`file-icon-badge ${file.isPdf ? 'file-icon-pdf' : (file.isImg ? 'file-icon-img' : 'file-icon-txt')}`}>
                            {file.isPdf ? 'PDF' : (file.isImg ? 'IMG' : 'DOC')}
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div 
                            style={{ 
                              fontSize: '0.85rem', 
                              fontWeight: 600, 
                              whiteSpace: 'nowrap', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              color: 'var(--text-primary)'
                            }}
                            title={file.name}
                          >
                            {file.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {formatFileSize(file.size)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '4px'
                          }}
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject / Title input */}
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label" htmlFor="topicTitle">
                  Subject / Topic Name <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>(Auto-filled from files or edit below)</span>
                </label>
                <input
                  id="topicTitle"
                  type="text"
                  className="form-input"
                  placeholder="e.g. AP Chemistry: Thermodynamics, Machine Learning Notes..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              {/* Optional instructions / extra notes */}
              <div className="form-group">
                <label className="form-label" htmlFor="extraNotes">
                  Additional Syllabus Instructions or Focus Areas <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>(Optional)</span>
                </label>
                <textarea
                  id="extraNotes"
                  rows={2}
                  className="form-input"
                  placeholder="e.g. Emphasize Chapter 3 reaction equations, ignore historical timelines, focus on calculus derivations..."
                  value={rawNotes}
                  onChange={(e) => setRawNotes(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* TAB 2: PROMPT / TOPIC */}
          {activeTab === 'prompt' && (
            <div style={{ marginBottom: '1.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="topic">Topic / Subject / Concept *</label>
                <input
                  id="topic"
                  type="text"
                  className="form-input"
                  placeholder="e.g. React 18 Suspense, Kubernetes Ingress, Rust Memory Safety..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              {/* Suggested Pills */}
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
            </div>
          )}

          {/* TAB 3: PASTE RAW NOTES TEXT */}
          {activeTab === 'notes' && (
            <div style={{ marginBottom: '1.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="notesText">
                  Paste Lecture Notes, Syllabus Bullet Points, or Textbook Text *
                </label>
                <textarea
                  id="notesText"
                  rows={6}
                  className="form-input"
                  placeholder="Paste lecture notes, textbook chapters, or curriculum bullet points here... The AI parses definitions, formulas, and facts to synthesize questions."
                  value={rawNotes}
                  onChange={(e) => setRawNotes(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="notesSubject">Subject Title (Optional)</label>
                <input
                  id="notesSubject"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Biology Unit 2: Cellular Structure"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Configuration Settings */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
                <option value="Easy">Easy (Foundational & Definitions)</option>
                <option value="Medium">Medium (Standard Curriculum)</option>
                <option value="Hard">Hard (Advanced / Complex Scenarios)</option>
              </select>
            </div>

            {/* Question Style */}
            <div>
              <label className="form-label">Question Style</label>
              <select 
                className="form-select"
                value={questionStyle}
                onChange={(e) => setQuestionStyle(e.target.value)}
              >
                <option value="Multiple Choice (Single Answer)">Multiple Choice (4 Options)</option>
                <option value="Technical Interview Focus">Technical Interview Focus</option>
                <option value="Scenario Based">Real-world Scenario Application</option>
              </select>
            </div>

            {/* Question Count Selector (Max 50) */}
            <div style={{
              gridColumn: '1 / -1',
              background: 'var(--bg-secondary)',
              padding: '1.1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={16} style={{ color: 'var(--gold)' }} />
                  Number of Questions: <strong style={{ color: 'var(--gold)', fontSize: '1.15rem' }}>{numQuestions}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', background: 'rgba(245, 158, 11, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    Max 50 Questions
                  </span>
                </label>
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  {[5, 10, 20, 30, 50].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNumQuestions(val)}
                      className={`btn btn-sm ${numQuestions === val ? 'btn-gold' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.6rem', fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      {val}Q
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#f59e0b' }}
                />
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={numQuestions}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) {
                      setNumQuestions(Math.min(50, Math.max(1, val)));
                    }
                  }}
                  className="form-input"
                  style={{ width: '75px', textAlign: 'center', padding: '0.35rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.65rem', fontSize: '0.8rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                <span>⏱️ Estimated Time: <strong style={{ color: 'var(--text-primary)' }}>~{Math.max(5, Math.ceil(numQuestions * 1.5))} mins</strong></span>
                <span>⭐ XP Reward: <strong style={{ color: 'var(--accent-cyan)' }}>+{numQuestions * 75} XP</strong></span>
                <span>🎯 Total Marks: <strong style={{ color: 'var(--gold)' }}>{numQuestions} Marks</strong></span>
              </div>
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
                <Sparkles size={18} className="spin" /> Generating your AI quiz...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scan size={18} /> 
                {activeTab === 'upload' && uploadedFiles.length > 0 
                  ? `Scan ${uploadedFiles.length} File(s) & Generate Quiz` 
                  : 'Generate Quiz with AI'}
              </span>
            )}
          </button>
        </form>

        {/* Live Generation & Scanning Visualizer */}
        {isGenerating && (
          <div className="scanner-container" style={{ marginTop: '1.75rem' }}>
            {activeTab === 'upload' && <div className="scanner-laser" />}
            <div style={{ textAlign: 'center', color: 'var(--text-primary)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-indigo)', fontWeight: 700, marginBottom: '0.5rem' }}>
                <Scan size={20} className="spin" />
                {activeTab === 'upload' ? 'AI Multimodal Document Scanner' : activeTab === 'notes' ? 'AI Notes Analyzer' : 'AI Quiz Generator'}
              </div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                {generationStep}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generated Quiz Preview Card */}
      {generatedQuiz && (
        <div className="card" style={{ border: '1.5px solid var(--success)', marginBottom: '4rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="badge badge-easy" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} /> Gemini AI Generation Complete
            </span>
            <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={16} /> Verified Gemini Output
            </span>
          </div>

          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{generatedQuiz.title}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {generatedQuiz.description}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '1rem 1.25rem',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            flexWrap: 'wrap'
          }}>
            <div><Layers size={15} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Questions: <strong>{generatedQuiz.questions.length}</strong></div>
            <div><Clock size={15} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Time: <strong>{generatedQuiz.timeLimitMinutes} Mins</strong></div>
            <div><Award size={15} style={{ verticalAlign: 'middle', marginRight: 4, color: 'var(--gold)' }} /> Reward: <strong style={{ color: 'var(--gold)' }}>+{generatedQuiz.xpReward} XP</strong></div>
          </div>

          {/* Questions Preview List */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Generated Questions Preview ({generatedQuiz.questions.length} Questions):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {generatedQuiz.questions.map((q, qIdx) => (
                <div 
                  key={q.id || qIdx} 
                  style={{ 
                    padding: '1rem 1.25rem', 
                    background: 'var(--bg-secondary)', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-subtle)' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {qIdx + 1}. {q.questionText}
                    </div>
                    {q.sourceReference && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', background: 'var(--bg-card)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        {q.sourceReference}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', marginBottom: '0.65rem' }}>
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctAnswer;
                      return (
                        <div 
                          key={optIdx} 
                          style={{ 
                            fontSize: '0.82rem', 
                            padding: '0.4rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)',
                            border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--border-subtle)'}`,
                            color: isCorrect ? 'var(--success)' : 'var(--text-secondary)',
                            fontWeight: isCorrect ? 700 : 400
                          }}
                        >
                          {['A', 'B', 'C', 'D'][optIdx]}: {opt} {isCorrect ? '✓' : ''}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.4rem' }}>
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleStartQuiz}
              className="btn btn-primary btn-lg"
              style={{ flex: 1, minWidth: 180, justifyContent: 'center' }}
            >
              <Play size={18} fill="currentColor" /> Take AI Quiz Now
            </button>
            <button
              onClick={handleShareQuiz}
              className="btn btn-gold btn-lg"
              style={{ flex: 1, minWidth: 180, justifyContent: 'center' }}
            >
              <Share2 size={18} /> Save & Share Quiz Link
            </button>
            <button
              onClick={handleOpenInStudio}
              className="btn btn-outline btn-lg"
              style={{ flex: 1, minWidth: 180, justifyContent: 'center' }}
            >
              <Edit3 size={18} /> Edit in Studio
            </button>
          </div>
        </div>
      )}

      {/* Share Quiz Modal */}
      <ShareQuizModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        quiz={savedQuizForShare}
      />
    </div>
  );
};

export default AiQuizGenPage;

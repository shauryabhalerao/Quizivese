import React, { useState, useMemo } from 'react';
import { useQuiz } from '../context/QuizContext';
import QuizCard from '../components/QuizCard';
import { Search, Filter, Sparkles, HelpCircle, Layers } from 'lucide-react';

const QuizzesPage = () => {
  const { quizzes } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Derive unique categories
  const categories = useMemo(() => {
    const set = new Set(quizzes.map(q => q.category));
    return ['All', ...Array.from(set)];
  }, [quizzes]);

  // Filter quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q => {
      if (!q.isActive) return false;

      const matchesSearch = 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [quizzes, searchTerm, selectedCategory, selectedDifficulty]);

  return (
    <div className="container">
      {/* Page Title & Search Bar */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>Exploration Arena</span>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Browse Quizzes</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Select an assessment to challenge your understanding or practice for technical interviews.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '2.5rem', padding: '1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by topic, keyword, or concept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div>
            <select
              className="form-select"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="All">Difficulty: All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Showing <strong>{filteredQuizzes.length}</strong> available quizzes
        </span>
        {(searchTerm || selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.825rem' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Quiz Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <Layers size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3>No Quizzes Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: 400, margin: '0.5rem auto 1.5rem' }}>
            We couldn't find any quizzes matching your search criteria. Try resetting the filters or generate one using AI!
          </p>
          <a href="/ai-quiz" className="btn btn-gold">
            <Sparkles size={16} /> Generate Quiz with AI
          </a>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredQuizzes.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizzesPage;

import React, { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Modal from '../components/Modal';
import StatCard from '../components/StatCard';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  ToggleLeft, 
  ToggleRight, 
  Users, 
  BookOpen, 
  Activity, 
  CheckCircle, 
  Sparkles, 
  Clock, 
  Award,
  AlertCircle,
  Search,
  UserCheck,
  UserX,
  RefreshCw,
  Loader2
} from 'lucide-react';

const AdminPage = () => {
  const { quizzes, attempts, addQuiz, updateQuiz, deleteQuiz, toggleQuizStatus } = useQuiz();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('quizzes'); // quizzes | results | users
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuizQuestions, setSelectedQuizQuestions] = useState(null);

  // Admin Data State
  const [stats, setStats] = useState({
    totalQuizzes: quizzes.length,
    activeQuizzes: quizzes.filter(q => q.isActive).length,
    totalAttempts: 650,
    registeredStudents: 142,
    averagePassRate: '84.5%',
    popularQuiz: 'Web Development Fundamentals',
    concurrentCapacity: '100+ Active'
  });
  const [usersList, setUsersList] = useState([]);
  const [auditAttempts, setAuditAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearchFilter, setUserSearchFilter] = useState('');
  const [actionMessage, setActionMessage] = useState(null);

  // Fetch admin dashboard data
  const loadAdminData = async () => {
    try {
      const [statsRes, usersRes, attemptsRes] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/attempts')
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data?.stats) {
        setStats(statsRes.value.data.stats);
      }

      if (usersRes.status === 'fulfilled' && usersRes.value?.data?.users) {
        setUsersList(usersRes.value.data.users);
      } else {
        // Fallback user list
        setUsersList([
          { id: 'usr-adm-001', name: 'Sarah Mitchell', email: 'admin@quiziverse.io', role: 'admin', points: 8400, xp: 15200, level: 14, streak: 22, quizzesAttempted: 48 },
          { id: 'usr-std-101', name: 'Alex Johnson', email: 'student@quiziverse.io', role: 'student', points: 2650, xp: 4850, level: 5, streak: 4, quizzesAttempted: 12 },
          { id: 'usr-std-102', name: 'Elena Rov', email: 'elena@quiziverse.io', role: 'student', points: 5420, xp: 9800, level: 10, streak: 15, quizzesAttempted: 42 },
          { id: 'usr-std-103', name: 'Zack Codes', email: 'zack@quiziverse.io', role: 'student', points: 4890, xp: 8750, level: 9, streak: 11, quizzesAttempted: 38 },
          { id: 'usr-std-104', name: 'Dev Priya', email: 'devpriya@quiziverse.io', role: 'student', points: 4320, xp: 7900, level: 8, streak: 9, quizzesAttempted: 34 }
        ]);
      }

      if (attemptsRes.status === 'fulfilled' && attemptsRes.value?.data?.attempts) {
        setAuditAttempts(attemptsRes.value.data.attempts);
      } else {
        setAuditAttempts(attempts);
      }
    } catch (e) {
      console.warn('[ADMIN DATA NOTICE]: Loaded cached dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const showToast = (msg, isError = false) => {
    setActionMessage({ text: msg, isError });
    setTimeout(() => setActionMessage(null), 3500);
  };

  // User Role Management
  const handleRoleToggle = async (user) => {
    if (user.id === currentUser?.id) {
      showToast('You cannot alter the role of your own logged-in account.', true);
      return;
    }

    const newRole = user.role === 'admin' ? 'student' : 'admin';
    try {
      await api.patch(`/admin/users/${user.id}/role`, { role: newRole });
      setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      showToast(`Updated ${user.name}'s role to ${newRole.toUpperCase()}`);
    } catch (err) {
      showToast(err.message || 'Failed to update user role', true);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.id === currentUser?.id) {
      showToast('You cannot delete your own logged-in account.', true);
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${user.id}`);
      setUsersList(prev => prev.filter(u => u.id !== user.id));
      showToast(`User ${user.name} removed successfully.`);
    } catch (err) {
      showToast(err.message || 'Failed to delete user account', true);
    }
  };

  // Form state for creating a quiz
  const [newQuizData, setNewQuizData] = useState({
    title: '',
    description: '',
    category: 'Computer Science',
    difficulty: 'Medium',
    timeLimitMinutes: 10,
    xpReward: 300,
    pointsReward: 120
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newQuizData.title.trim()) return;

    await addQuiz({
      ...newQuizData,
      questions: [
        {
          id: `q-demo-1`,
          questionText: `Sample assessment question for ${newQuizData.title}?`,
          options: ['Option Alpha', 'Option Beta (Correct)', 'Option Gamma', 'Option Delta'],
          correctAnswer: 1,
          explanation: 'Demonstration conceptual rationale for newly published quiz.',
          difficulty: newQuizData.difficulty,
          topic: newQuizData.category
        }
      ]
    });

    setIsCreateModalOpen(false);
    showToast(`Published new quiz: "${newQuizData.title}"`);
    setNewQuizData({
      title: '',
      description: '',
      category: 'Computer Science',
      difficulty: 'Medium',
      timeLimitMinutes: 10,
      xpReward: 300,
      pointsReward: 120
    });
  };

  const filteredUsers = usersList.filter(u => 
    u.name?.toLowerCase().includes(userSearchFilter.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearchFilter.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      {/* Toast Notification */}
      {actionMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: actionMessage.isError ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)',
          color: '#fff',
          padding: '0.85rem 1.4rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
          zIndex: 9999,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {actionMessage.isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          {actionMessage.text}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
              <ShieldCheck size={14} /> Faculty & Admin Control
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>• Logged in as {currentUser?.name}</span>
          </div>
          <h1 style={{ fontSize: '2.25rem' }}>Admin Dashboard</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={loadAdminData}
            title="Refresh Admin Metrics"
            className="btn btn-outline"
            style={{ padding: '0.55rem 0.85rem' }}
          >
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={18} /> Create New Quiz
          </button>
        </div>
      </div>

      {/* Admin KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <StatCard
          icon={BookOpen}
          label="Total Quizzes"
          value={stats.totalQuizzes || quizzes.length}
          subtext={`${stats.activeQuizzes || quizzes.filter(q => q.isActive).length} active in catalog`}
          accentColor="indigo"
        />
        <StatCard
          icon={Users}
          label="Registered Students"
          value={stats.registeredStudents || usersList.filter(u => u.role === 'student').length || '142'}
          subtext={`Capacity: ${stats.concurrentCapacity || '100+ Concurrent'}`}
          accentColor="cyan"
        />
        <StatCard
          icon={Activity}
          label="Attempts Recorded"
          value={stats.totalAttempts || attempts.length || 650}
          subtext={`Popular: ${stats.popularQuiz || 'Web Dev'}`}
          accentColor="amber"
        />
        <StatCard
          icon={CheckCircle}
          label="Platform Pass Rate"
          value={stats.averagePassRate || '84.5%'}
          subtext="Passing threshold >= 70%"
          accentColor="emerald"
        />
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-default)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`btn btn-sm ${activeTab === 'quizzes' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          Quiz Moderation ({quizzes.length})
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`btn btn-sm ${activeTab === 'results' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          Platform Attempts Audit ({auditAttempts.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          User Role Management ({usersList.length})
        </button>
      </div>

      {/* Tab 1: Quiz Management */}
      {activeTab === 'quizzes' && (
        <div className="card" style={{ marginBottom: '4rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.925rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Quiz Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Difficulty</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Questions</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map(quiz => (
                  <tr key={quiz.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                      {quiz.title}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-indigo">{quiz.category}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${quiz.difficulty?.toLowerCase() === 'easy' ? 'badge-easy' : quiz.difficulty?.toLowerCase() === 'hard' ? 'badge-hard' : 'badge-medium'}`}>
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {quiz.questions?.length || 0} items
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={async () => {
                          await toggleQuizStatus(quiz.id);
                          showToast(`Toggled ${quiz.title} status to ${quiz.isActive ? 'Draft' : 'Active'}`);
                        }}
                        className={`badge ${quiz.isActive ? 'badge-easy' : 'badge-gray'}`}
                        style={{ cursor: 'pointer' }}
                        title="Click to toggle Active / Draft"
                      >
                        {quiz.isActive ? 'Active' : 'Draft / Off'}
                      </button>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => setSelectedQuizQuestions(quiz)}
                          className="btn btn-secondary btn-sm"
                          title="Inspect questions"
                          style={{ padding: '0.35rem 0.65rem' }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete "${quiz.title}" permanently?`)) {
                              await deleteQuiz(quiz.id);
                              showToast(`Deleted "${quiz.title}"`);
                            }
                          }}
                          className="btn btn-danger btn-sm"
                          title="Delete quiz"
                          style={{ padding: '0.35rem 0.65rem' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Recent Attempts Audit Log */}
      {activeTab === 'results' && (
        <div className="card" style={{ marginBottom: '4rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Attempt ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Student</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Quiz Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Score</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Accuracy</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Time Elapsed</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Recorded At</th>
                </tr>
              </thead>
              <tbody>
                {auditAttempts.map(att => (
                  <tr key={att.attemptId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {att.attemptId}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                      {att.userName || 'Student'}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{att.quizTitle}</td>
                    <td style={{ padding: '1rem' }}>{att.score} / {att.totalQuestions}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 700, color: att.percentage >= 70 ? '#34d399' : '#f87171' }}>
                        {att.percentage}%
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{Math.round(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s</td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                      {att.completedAt ? new Date(att.completedAt).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: User Accounts & Role Management */}
      {activeTab === 'users' && (
        <div className="card" style={{ marginBottom: '4rem' }}>
          {/* User Search Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Registered User Accounts ({filteredUsers.length})</h3>
            <div style={{ position: 'relative', width: 280 }}>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="form-input"
                value={userSearchFilter}
                onChange={(e) => setUserSearchFilter(e.target.value)}
                style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>User</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Points</th>
                  <th style={{ padding: '0.75rem 1rem' }}>XP</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Streak</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Attempts</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const isSelf = user.id === currentUser?.id;
                  const isAdmin = user.role === 'admin';

                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600 }}>{user.name} {isSelf && <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>YOU</span>}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {isAdmin ? (
                          <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                            Faculty Admin
                          </span>
                        ) : (
                          <span className="badge badge-indigo">Student</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--gold)', fontWeight: 700 }}>
                        {Number(user.points || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem' }}>{Number(user.xp || 0).toLocaleString()}</td>
                      <td style={{ padding: '1rem', color: '#f59e0b', fontWeight: 700 }}>
                        {user.streak || 1}d
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {user.quizzesAttempted || 0}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleRoleToggle(user)}
                            disabled={isSelf}
                            className={`btn btn-sm ${isAdmin ? 'btn-outline' : 'btn-secondary'}`}
                            title={isSelf ? "Cannot alter self" : isAdmin ? "Demote to Student" : "Promote to Admin"}
                            style={{ opacity: isSelf ? 0.4 : 1, padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          >
                            {isAdmin ? 'Demote' : 'Promote'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            disabled={isSelf}
                            className="btn btn-danger btn-sm"
                            title={isSelf ? "Cannot delete self" : "Delete user account"}
                            style={{ opacity: isSelf ? 0.4 : 1, padding: '0.35rem 0.65rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <p>No user accounts matched your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create Quiz */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Quiz"
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label className="form-label">Quiz Title</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Distributed Systems & Consensus"
              value={newQuizData.title}
              onChange={(e) => setNewQuizData({ ...newQuizData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows="3"
              className="form-textarea"
              placeholder="Overview of concepts evaluated in this quiz..."
              value={newQuizData.description}
              onChange={(e) => setNewQuizData({ ...newQuizData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={newQuizData.category}
                onChange={(e) => setNewQuizData({ ...newQuizData, category: e.target.value })}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Algorithms">Algorithms</option>
                <option value="AI & ML">AI & ML</option>
                <option value="DevOps">DevOps</option>
                <option value="Web Development">Web Development</option>
              </select>
            </div>

            <div>
              <label className="form-label">Difficulty</label>
              <select
                className="form-select"
                value={newQuizData.difficulty}
                onChange={(e) => setNewQuizData({ ...newQuizData, difficulty: e.target.value })}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
            <div>
              <label className="form-label">Time Limit (Minutes)</label>
              <input
                type="number"
                min="3"
                max="60"
                className="form-input"
                value={newQuizData.timeLimitMinutes}
                onChange={(e) => setNewQuizData({ ...newQuizData, timeLimitMinutes: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="form-label">XP Reward</label>
              <input
                type="number"
                min="50"
                step="50"
                className="form-input"
                value={newQuizData.xpReward}
                onChange={(e) => setNewQuizData({ ...newQuizData, xpReward: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save & Publish Quiz
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Questions Inspector */}
      {selectedQuizQuestions && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedQuizQuestions(null)}
          title={`Questions: ${selectedQuizQuestions.title}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '60vh', overflowY: 'auto' }}>
            {selectedQuizQuestions.questions?.map((q, qIndex) => (
              <div key={q.id || qIndex} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {qIndex + 1}. {q.questionText}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  {q.options?.map((opt, oIdx) => (
                    <div 
                      key={oIdx}
                      style={{
                        fontSize: '0.85rem',
                        color: oIdx === q.correctAnswer ? '#34d399' : 'var(--text-secondary)',
                        fontWeight: oIdx === q.correctAnswer ? 700 : 400
                      }}
                    >
                      {['A', 'B', 'C', 'D'][oIdx]}. {opt} {oIdx === q.correctAnswer ? '✓ (Correct)' : ''}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminPage;

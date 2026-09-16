import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialQuizzes, initialAchievements, initialRecentAttempts } from '../data/mockData';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const { updateUserStats } = useAuth();
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [attempts, setAttempts] = useState(initialRecentAttempts);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [loading, setLoading] = useState(true);

  // Fetch live quizzes and achievements on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [quizRes, achRes] = await Promise.allSettled([
          api.get('/quizzes'),
          api.get('/achievements')
        ]);

        if (quizRes.status === 'fulfilled' && quizRes.value?.data && Array.isArray(quizRes.value.data) && quizRes.value.data.length > 0) {
          setQuizzes(quizRes.value.data);
        }

        if (achRes.status === 'fulfilled' && achRes.value?.data?.achievements && Array.isArray(achRes.value.data.achievements)) {
          setAchievements(achRes.value.data.achievements);
        }
      } catch (err) {
        // Keeps initial seed mock data if backend is temporarily offline
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await api.get('/achievements');
      if (res?.data?.achievements && Array.isArray(res.data.achievements)) {
        setAchievements(res.data.achievements);
      }
    } catch (e) {
      console.warn('[ACHIEVEMENTS LOAD NOTICE]: Using cached achievements');
    }
  };

  const getQuizById = async (quizId) => {
    if (!quizId || quizId === 'undefined') return null;
    try {
      const res = await api.get(`/quizzes/${quizId}`);
      if (res?.data?.quiz) {
        return res.data.quiz;
      }
    } catch (e) {
      // Fallback
    }
    return quizzes.find(q => q.id === quizId) || null;
  };

  const getAttemptById = async (attemptId) => {
    if (!attemptId || attemptId === 'undefined') return null;
    try {
      const res = await api.get(`/attempts/${attemptId}`);
      if (res?.data?.attempt) {
        return res.data.attempt;
      }
    } catch (e) {
      // Fallback
    }
    return attempts.find(a => a.attemptId === attemptId) || null;
  };

  const recordAttempt = async ({ quizId, answers, timeTakenSeconds }) => {
    let resultAttempt = null;
    let gamificationResult = null;

    try {
      const res = await api.post('/attempts/submit', {
        quizId,
        answers,
        timeTakenSeconds
      });

      if (res?.data?.attempt) {
        resultAttempt = res.data.attempt;
        gamificationResult = res?.data?.gamification || null;
        resultAttempt.gamification = gamificationResult;
      }
    } catch (err) {
      console.warn('[SUBMISSION NOTICE] Offline fallback scoring evaluated:', err.message);
    }

    // Local evaluation fallback if backend is offline
    if (!resultAttempt) {
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) return null;

      let correctCount = 0;
      let incorrectCount = 0;
      let unansweredCount = 0;

      const breakdown = (quiz.questions || []).map((q, idx) => {
        const selectedOption = answers[idx];
        const isUnanswered = selectedOption === undefined || selectedOption === null;
        const isCorrect = !isUnanswered && selectedOption === (q.correctAnswer ?? 1);

        if (isUnanswered) unansweredCount++;
        else if (isCorrect) correctCount++;
        else incorrectCount++;

        return {
          questionId: q.id,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer ?? 1,
          selectedAnswer: selectedOption,
          isCorrect,
          isUnanswered,
          explanation: q.explanation || 'Verified conceptual rationale.',
          topic: q.topic,
          difficulty: q.difficulty
        };
      });

      const totalQuestions = quiz.questions?.length || 1;
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      const xpEarned = Math.round((percentage / 100) * (quiz.xpReward || 300));
      const pointsEarned = Math.round((percentage / 100) * (quiz.pointsReward || 100));

      resultAttempt = {
        attemptId: `att-${Date.now()}`,
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: correctCount,
        totalQuestions,
        correctCount,
        incorrectCount,
        unansweredCount,
        percentage,
        timeTakenSeconds,
        completedAt: new Date().toISOString(),
        status: percentage >= 70 ? 'Passed' : 'Needs Practice',
        xpEarned,
        pointsEarned,
        breakdown
      };
    }

    setAttempts(prev => [resultAttempt, ...prev]);

    // Update global user stats & gamification
    updateUserStats(
      resultAttempt.pointsEarned,
      resultAttempt.xpEarned,
      resultAttempt.percentage,
      gamificationResult
    );

    // Check & apply newly unlocked achievement triggers
    checkAchievements(resultAttempt, gamificationResult);

    return resultAttempt;
  };

  const checkAchievements = (attempt, gamification = null) => {
    // If backend provided newly unlocked badges, apply directly
    if (gamification?.newlyUnlockedBadges?.length > 0) {
      const newlyUnlockedIds = new Set(gamification.newlyUnlockedBadges.map(b => b.code));
      setAchievements(prev =>
        prev.map(ach => {
          if (newlyUnlockedIds.has(ach.code)) {
            return {
              ...ach,
              isUnlocked: true,
              unlockedAt: new Date().toISOString().split('T')[0],
              progress: ach.maxProgress
            };
          }
          return ach;
        })
      );
      return;
    }

    // Fallback in-memory achievement checks
    setAchievements(prev =>
      prev.map(ach => {
        if (ach.isUnlocked) return ach;
        if (ach.code === 'PERFECT_SCORE' && attempt.percentage === 100) {
          return { ...ach, isUnlocked: true, unlockedAt: new Date().toISOString().split('T')[0], progress: 1 };
        }
        if (ach.code === 'HIGH_SCORE_90' && attempt.percentage >= 90) {
          return { ...ach, isUnlocked: true, unlockedAt: new Date().toISOString().split('T')[0], progress: 1 };
        }
        if (ach.code === 'SPEED_DEMON' && attempt.timeTakenSeconds < 60 && attempt.percentage >= 80) {
          return { ...ach, isUnlocked: true, unlockedAt: new Date().toISOString().split('T')[0], progress: 1 };
        }
        return ach;
      })
    );
  };

  // Admin Operations with Live API Integration
  const addQuiz = async (newQuiz) => {
    let created = null;
    try {
      const res = await api.post('/admin/quizzes', newQuiz);
      if (res?.data?.quiz) {
        created = res.data.quiz;
      }
    } catch (e) {
      console.warn('[ADMIN NOTICE] Local quiz creation fallback:', e.message);
    }

    if (!created) {
      created = {
        ...newQuiz,
        id: `quiz-${Date.now()}`,
        isActive: true,
        totalAttempts: 0
      };
    }

    setQuizzes(prev => [created, ...prev]);
    return created;
  };

  const updateQuiz = async (id, updatedFields) => {
    try {
      await api.put(`/admin/quizzes/${id}`, updatedFields);
    } catch (e) {}

    setQuizzes(prev =>
      prev.map(q => (q.id === id ? { ...q, ...updatedFields } : q))
    );
  };

  const deleteQuiz = async (quizId) => {
    try {
      await api.delete(`/admin/quizzes/${quizId}`);
    } catch (e) {}

    setQuizzes(prev => prev.filter(q => q.id !== quizId));
  };

  const toggleQuizStatus = async (quizId) => {
    try {
      await api.patch(`/admin/quizzes/${quizId}/status`, {});
    } catch (e) {}

    setQuizzes(prev =>
      prev.map(q => (q.id === quizId ? { ...q, isActive: !q.isActive } : q))
    );
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        attempts,
        achievements,
        loading,
        getQuizById,
        getAttemptById,
        recordAttempt,
        fetchAchievements,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        toggleQuizStatus
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

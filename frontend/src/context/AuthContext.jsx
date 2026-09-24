import React, { createContext, useContext, useState, useEffect } from 'react';
import { demoUsers } from '../data/mockData';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('quiziverse_user');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...demoUsers.student,
            ...parsed,
            name: parsed.name || demoUsers.student.name
          };
        }
      }
    } catch (e) {
      console.warn('[AUTH RECOVERY] Resetting corrupted local user cache:', e);
    }
    return demoUsers.student;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('quiziverse_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('quiziverse_user');
        api.setToken(null);
      }
    } catch (e) {
      console.warn('[AUTH STORAGE] Could not persist user to localStorage:', e);
    }
  }, [currentUser]);

  // Sync profile on mount if token exists
  useEffect(() => {
    const token = api.getToken();
    if (token) {
      api.get('/auth/me')
        .then(res => {
          if (res?.data?.user) {
            setCurrentUser(prev => ({ ...prev, ...res.data.user }));
          }
        })
        .catch(() => {
          // Keep offline state if server is not yet running
        });
    }
  }, []);

  const login = async (email, password, roleOverride = null) => {
    setLoading(true);

    // Fast-path demo shortcuts
    if (roleOverride === 'admin' || (email && email.toLowerCase().includes('admin'))) {
      setCurrentUser(demoUsers.admin);
      api.setToken('mock-admin-jwt-token');
      setLoading(false);
      return { success: true, user: demoUsers.admin };
    }

    if (roleOverride === 'teacher' || (email && email.toLowerCase().includes('teacher'))) {
      setCurrentUser(demoUsers.teacher);
      api.setToken('mock-teacher-jwt-token');
      setLoading(false);
      return { success: true, user: demoUsers.teacher };
    }

    if (roleOverride === 'student') {
      setCurrentUser(demoUsers.student);
      api.setToken('mock-student-jwt-token');
      setLoading(false);
      return { success: true, user: demoUsers.student };
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response?.data?.user && response?.data?.token) {
        api.setToken(response.data.token);
        setCurrentUser(response.data.user);
        setLoading(false);
        return { success: true, user: response.data.user };
      }
    } catch (err) {
      // If backend is offline during frontend-only runs, fallback to mock user
      console.warn('[AUTH NOTICE] Backend login endpoint returned notice. Using local profile:', err.message);
    }

    const fallbackUser = {
      ...demoUsers.student,
      email: email || demoUsers.student.email,
      name: email ? email.split('@')[0] : demoUsers.student.name
    };
    setCurrentUser(fallbackUser);
    setLoading(false);
    return { success: true, user: fallbackUser };
  };

  const register = async ({ name, email, password, grade }) => {
    setLoading(true);

    try {
      const response = await api.post('/auth/register', { name, email, password, grade });
      if (response?.data?.user && response?.data?.token) {
        api.setToken(response.data.token);
        setCurrentUser(response.data.user);
        setLoading(false);
        return { success: true, user: response.data.user };
      }
    } catch (err) {
      console.warn('[AUTH NOTICE] Using local registration fallback:', err.message);
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: 'student',
      grade: grade || 'Undergraduate',
      points: 100,
      xp: 200,
      level: 1,
      streak: 1,
      rank: 25,
      quizzesAttempted: 0,
      averagePercentage: 0
    };

    setCurrentUser(newUser);
    setLoading(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    api.setToken(null);
  };

  const updateUserStats = (pointsEarned, xpEarned, percentage, gamification = null) => {
    if (!currentUser) return;
    setCurrentUser(prev => {
      const newAttempts = (prev.quizzesAttempted || 0) + 1;
      const prevTotalScore = ((prev.averagePercentage || 0) * (prev.quizzesAttempted || 0));
      const newAvg = Number(((prevTotalScore + percentage) / newAttempts).toFixed(1));

      if (gamification) {
        return {
          ...prev,
          points: gamification.totalPoints ?? ((prev.points || 0) + pointsEarned),
          xp: gamification.totalXp ?? ((prev.xp || 0) + xpEarned),
          level: gamification.level?.level ?? (Math.floor(((prev.xp || 0) + xpEarned) / 1000) + 1),
          streak: gamification.streak?.currentStreak ?? prev.streak,
          longestStreak: gamification.streak?.longestStreak ?? prev.longestStreak,
          quizzesAttempted: newAttempts,
          averagePercentage: newAvg
        };
      }

      const newXP = (prev.xp || 0) + xpEarned;
      const newLevel = Math.floor(newXP / 1000) + 1;

      return {
        ...prev,
        points: (prev.points || 0) + pointsEarned,
        xp: newXP,
        level: newLevel,
        quizzesAttempted: newAttempts,
        averagePercentage: newAvg
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        updateUserStats,
        loading,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        isTeacher: currentUser?.role === 'teacher' || currentUser?.role === 'admin',
        isStudent: currentUser?.role === 'student'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

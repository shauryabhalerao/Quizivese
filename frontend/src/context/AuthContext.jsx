import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedToken = api.getToken();
      const savedUser = localStorage.getItem('quiziverse_user');
      if (savedToken && savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[AUTH RECOVERY] Resetting corrupted local user cache:', e);
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  // Sync user state with localStorage (never store password)
  useEffect(() => {
    try {
      if (currentUser) {
        // Strip any unexpected sensitive properties before persisting profile
        const { password, password_hash, token, ...safeUser } = currentUser;
        localStorage.setItem('quiziverse_user', JSON.stringify(safeUser));
      } else {
        localStorage.removeItem('quiziverse_user');
      }
    } catch (e) {
      console.warn('[AUTH STORAGE] Could not persist user profile to localStorage:', e);
    }
  }, [currentUser]);

  // Authenticate session on mount if token exists
  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    api.get('/auth/me')
      .then(res => {
        if (res?.data?.user) {
          setCurrentUser(res.data.user);
        } else {
          api.setToken(null);
          setCurrentUser(null);
        }
      })
      .catch((err) => {
        // If server returns 401/403 or invalid token, clear session
        if (err.status === 401 || err.status === 403) {
          api.setToken(null);
          setCurrentUser(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response?.data?.user && response?.data?.token) {
        api.setToken(response.data.token);
        const { password_hash, password, ...safeUser } = response.data.user;
        setCurrentUser(safeUser);
        setLoading(false);
        return { success: true, user: safeUser };
      }
      throw new Error(response?.message || 'Invalid email or password.');
    } catch (err) {
      setLoading(false);
      const friendlyMessage = err.status === 401 
        ? 'Invalid email or password.' 
        : (err.message || 'Failed to sign in. Please try again.');
      return { success: false, error: friendlyMessage };
    }
  };

  const register = async ({ name, email, password, grade }) => {
    setLoading(true);

    try {
      const response = await api.post('/auth/register', { name, email, password, grade });
      if (response?.data?.user && response?.data?.token) {
        api.setToken(response.data.token);
        const { password_hash, password, ...safeUser } = response.data.user;
        setCurrentUser(safeUser);
        setLoading(false);
        return { success: true, user: safeUser };
      }
      throw new Error(response?.message || 'Registration failed.');
    } catch (err) {
      setLoading(false);
      const friendlyMessage = err.status === 409
        ? 'An account with this email address already exists.'
        : (err.message || 'Registration failed. Please try again.');
      return { success: false, error: friendlyMessage };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    api.setToken(null);
    localStorage.removeItem('quiziverse_user');
  };

  const updateUserStats = (pointsEarned, xpEarned, percentage, gamification = null) => {
    if (!currentUser) return;
    setCurrentUser(prev => {
      if (!prev) return null;
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
        isStudent: currentUser?.role === 'student' || !currentUser?.role
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

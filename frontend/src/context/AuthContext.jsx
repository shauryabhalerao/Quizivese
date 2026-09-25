import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../services/supabase';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync Supabase Auth session & listener
  useEffect(() => {
    let mounted = true;

    // 1. Restore active Supabase session on mount
    async function getInitialSession() {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) console.warn('[Supabase Session Recovery Warning]:', error.message);

        if (mounted && initialSession?.user) {
          setSession(initialSession);
          api.setToken(initialSession.access_token);
          await loadUserProfile(initialSession.user, initialSession.access_token);
        } else {
          // Clear any legacy localStorage tokens
          localStorage.removeItem('quiziverse_user');
          localStorage.removeItem('quiziverse_token');
        }
      } catch (err) {
        console.error('[AuthInit Error]:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    getInitialSession();

    // 2. Listen for Supabase Auth state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`[Supabase Auth Event]: ${event}`);

      if (currentSession?.user) {
        setSession(currentSession);
        api.setToken(currentSession.access_token);
        await loadUserProfile(currentSession.user, currentSession.access_token);
      } else {
        setSession(null);
        setCurrentUser(null);
        api.setToken(null);
        localStorage.removeItem('quiziverse_user');
        localStorage.removeItem('quiziverse_token');
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Helper to construct / fetch user profile
  const loadUserProfile = async (sbUser, accessToken) => {
    try {
      // Attempt backend me endpoint
      const res = await api.get('/auth/me');
      if (res?.data?.user) {
        setCurrentUser(res.data.user);
        return;
      }
    } catch (err) {
      // Backend offline or me route unreachable - construct profile from Supabase user metadata
    }

    const fallbackProfile = {
      id: sbUser.id,
      name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Student',
      email: sbUser.email,
      role: sbUser.user_metadata?.role || 'student',
      grade: sbUser.user_metadata?.grade || 'Undergraduate',
      points: 100,
      xp: 200,
      level: 1,
      current_streak: 1,
      created_at: sbUser.created_at
    };

    setCurrentUser(fallbackProfile);
  };

  // Login via Supabase Auth
  const login = async (email, password) => {
    setLoading(true);
    try {
      // 1. Direct Supabase Auth login
      const { data: sbData, error: sbErr } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (sbErr) {
        // If Supabase client fails, try backend API endpoint
        const apiRes = await api.post('/auth/login', { email, password });
        if (apiRes?.data?.user) {
          if (apiRes.data.token) api.setToken(apiRes.data.token);
          setCurrentUser(apiRes.data.user);
          setLoading(false);
          return { success: true, user: apiRes.data.user };
        }
        throw new Error(sbErr.message || 'Invalid email or password.');
      }

      const sbUser = sbData.user;
      const sbSession = sbData.session;

      if (sbSession) {
        setSession(sbSession);
        api.setToken(sbSession.access_token);
      }

      await loadUserProfile(sbUser, sbSession?.access_token);
      setLoading(false);
      return { success: true, user: currentUser };
    } catch (err) {
      setLoading(false);
      const friendlyMsg = err.message?.includes('Invalid login credentials') || err.status === 401
        ? 'Invalid email or password.'
        : (err.message || 'Failed to sign in. Please try again.');
      return { success: false, error: friendlyMsg };
    }
  };

  // Register via Supabase Auth
  const register = async ({ name, email, password, grade }) => {
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();

      // 1. Direct Supabase Auth signUp
      const { data: sbData, error: sbErr } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            name: name.trim(),
            grade
          }
        }
      });

      if (sbErr) {
        console.warn('[Supabase Register Error]:', sbErr);
        if (sbErr.status === 429 || sbErr.code === 'over_email_send_rate_limit') {
          throw new Error('Too many signup emails have been requested. Please wait a while and try again.');
        }
        if (sbErr.status === 422 || sbErr.message?.includes('already registered')) {
          throw new Error('An account with this email address already exists.');
        }

        // Try backend API registration endpoint
        const apiRes = await api.post('/auth/register', { name, email, password, grade });
        if (apiRes?.data?.user) {
          if (apiRes.data.token) api.setToken(apiRes.data.token);
          setCurrentUser(apiRes.data.user);
          setLoading(false);
          return { success: true, user: apiRes.data.user };
        }

        throw new Error(sbErr.message || 'Unable to create your account.');
      }

      if (!sbData?.user) {
        throw new Error('Unable to create your account. Please try again.');
      }

      // Also inform backend to sync profile
      try {
        await api.post('/auth/register', { name, email, password, grade });
      } catch (e) {
        // Non-critical if backend sync fails as Supabase Auth succeeded
      }

      const sbUser = sbData.user;
      const sbSession = sbData.session;

      if (sbSession) {
        setSession(sbSession);
        api.setToken(sbSession.access_token);
        await loadUserProfile(sbUser, sbSession.access_token);
      } else {
        // Email confirmation is required by Supabase project settings
        setLoading(false);
        return {
          success: true,
          emailConfirmationRequired: true,
          message: 'Account created! Please check your email inbox to confirm your account.'
        };
      }

      setLoading(false);
      return { success: true, user: currentUser };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message || 'Registration failed. Please try again.' };
    }
  };

  // Logout via Supabase Auth
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('[Supabase SignOut Notice]:', e);
    } finally {
      setSession(null);
      setCurrentUser(null);
      api.setToken(null);
      localStorage.removeItem('quiziverse_user');
      localStorage.removeItem('quiziverse_token');
    }
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
        session,
        login,
        register,
        logout,
        updateUserStats,
        loading,
        isAuthenticated: !!currentUser || !!session,
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

import crypto from 'crypto';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { pool } from '../config/db.js';
import { sendPasswordResetEmail } from '../services/email.service.js';
import supabase from '../config/supabase.js';


// In-memory fallback store for offline development when PostgreSQL is not running
let mockUsers = [
  {
    id: 'usr-std-101',
    name: 'Alex Johnson',
    email: 'student@quiziverse.io',
    password_hash: '$2a$10$2U4EPpZAkl8X6.ZilY/ROOlE9uo5HVNCUjq47z5IxebZ7Kby2pZbO', // 'StudentPass123!'
    role: 'student',
    grade: 'Undergraduate',
    points: 2650,
    xp: 4850,
    level: 5,
    current_streak: 4,
    rank: 6
  },
  {
    id: 'usr-adm-001',
    name: 'Sarah Mitchell',
    email: 'admin@quiziverse.io',
    password_hash: '$2a$10$sLz9uFw4tDHWALkgO.Dn7.0btRHZ.EP6qkbd6pzP5lVuMb3ejqp/i', // 'AdminPass123!'
    role: 'admin',
    grade: 'Faculty Lead',
    points: 8400,
    xp: 15200,
    level: 14,
    current_streak: 22,
    rank: 1
  }
];

export const register = async (req, res, next) => {
  try {
    const { name, email, password, grade = 'Undergraduate' } = req.body;

    if (!name || name.trim().length < 2) {
      throw ApiError.badRequest('Please enter your name.');
    }
    if (!email || !email.includes('@')) {
      throw ApiError.badRequest('Please enter a valid email address.');
    }
    if (!password || password.length < 8) {
      throw ApiError.badRequest('Password must be at least 8 characters.');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Call Supabase Auth signUp to create user in auth.users
    let supabaseUser = null;
    let supabaseSession = null;
    let supabaseAuthError = null;

    try {
      const { data: sbData, error: sbErr } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: password,
        options: {
          data: {
            name: name.trim(),
            grade: grade
          }
        }
      });

      if (sbErr) {
        supabaseAuthError = sbErr;
        console.warn('[Supabase Auth Register Warning]:', sbErr.message);
        if (sbErr.status === 422 || sbErr.message.includes('already registered')) {
          throw ApiError.conflict('An account with this email address already exists.');
        }
      } else if (sbData?.user) {
        supabaseUser = sbData.user;
        supabaseSession = sbData.session;
      }
    } catch (sbEx) {
      if (sbEx.statusCode === 409) throw sbEx;
      console.warn('[Supabase Auth Register Exception]:', sbEx.message);
    }

    const userId = supabaseUser ? supabaseUser.id : `usr-${Date.now()}`;
    const passwordHash = await hashPassword(password);

    let newUser = null;

    // 2. Sync profile into PostgreSQL users table or mockUsers
    try {
      const checkResult = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
      if (checkResult.rows.length > 0) {
        throw ApiError.conflict('An account with this email address already exists.');
      }

      const insertResult = await pool.query(
        `INSERT INTO users (id, name, email, password_hash, role, grade, points, xp, level, current_streak)
         VALUES ($1, $2, $3, $4, 'student', $5, 100, 200, 1, 1)
         RETURNING id, name, email, role, grade, points, xp, level, current_streak, created_at`,
        [userId, name.trim(), normalizedEmail, passwordHash, grade]
      );

      newUser = insertResult.rows[0];
    } catch (dbErr) {
      if (dbErr.statusCode === 409) throw dbErr;

      const existing = mockUsers.find(u => u.email === normalizedEmail);
      if (existing) {
        throw ApiError.conflict('An account with this email address already exists.');
      }

      newUser = {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role: 'student',
        grade,
        points: 100,
        xp: 200,
        level: 1,
        current_streak: 1,
        rank: mockUsers.length + 1
      };
      mockUsers.push(newUser);
    }

    // Generate signed JWT Token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    });

    const { password_hash, ...safeUser } = newUser;

    return sendCreated(res, { user: safeUser, token, supabaseSession }, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required.');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Authenticate with Supabase Auth first
    let supabaseAuthSuccess = false;
    let supabaseUser = null;
    let supabaseSession = null;

    try {
      const { data: sbData, error: sbErr } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password
      });

      if (!sbErr && sbData?.user) {
        supabaseAuthSuccess = true;
        supabaseUser = sbData.user;
        supabaseSession = sbData.session;
      } else if (sbErr) {
        console.warn('[Supabase Auth Login Warning]:', sbErr.message);
      }
    } catch (sbEx) {
      console.warn('[Supabase Auth Login Exception]:', sbEx.message);
    }

    // 2. Query Database / Mock store
    let user = null;
    try {
      const dbResult = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
      if (dbResult.rows.length > 0) {
        user = dbResult.rows[0];
      }
    } catch (dbErr) {
      user = mockUsers.find(u => u.email === normalizedEmail);
    }

    // Validate credentials locally if Supabase Auth didn't explicitly succeed
    if (!supabaseAuthSuccess) {
      if (!user) {
        throw ApiError.unauthorized('Invalid email or password.');
      }

      let isPasswordValid = false;
      if (user.password_hash) {
        isPasswordValid = await comparePassword(password, user.password_hash);
      }

      if (!isPasswordValid) {
        throw ApiError.unauthorized('Invalid email or password.');
      }
    } else {
      // If user profile doesn't exist locally, instantiate safe profile
      if (!user) {
        user = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          role: 'student',
          grade: supabaseUser.user_metadata?.grade || 'Undergraduate',
          points: 100,
          xp: 200,
          level: 1,
          current_streak: 1
        };
        mockUsers.push(user);
      }
    }

    // Update last_active_at in DB
    try {
      await pool.query('UPDATE users SET last_active_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
    } catch (e) {
      // Ignore if offline
    }

    // Generate signed JWT Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    const { password_hash, reset_password_token, reset_password_code, reset_password_expires, ...safeUser } = user;

    return sendSuccess(res, { user: safeUser, token, supabaseSession }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'usr-std-101';
    let user = null;

    try {
      const dbResult = await pool.query(
        'SELECT id, name, email, role, grade, points, xp, level, current_streak, longest_streak, last_active_at, created_at FROM users WHERE id = $1',
        [userId]
      );
      if (dbResult.rows.length > 0) {
        user = dbResult.rows[0];
      }
    } catch (e) {
      user = mockUsers.find(u => u.id === userId) || mockUsers[0];
    }

    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }

    const { password_hash, reset_password_token, reset_password_code, reset_password_expires, ...safeUser } = user;
    return sendSuccess(res, { user: safeUser }, 'User profile retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/forgot-password
 * Initiates password reset by generating a single-use token and 6-digit code.
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();

    let user = null;
    try {
      const dbResult = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
      if (dbResult.rows.length > 0) {
        user = dbResult.rows[0];
      }
    } catch (e) {
      user = mockUsers.find(u => u.email === normalizedEmail);
    }

    const genericMsg = "If an account exists with this email, we've sent password reset instructions.";

    // If user does not exist, return generic message without exposing existence
    if (!user) {
      return res.status(200).json({
        success: true,
        message: genericMsg,
        data: null
      });
    }

    // Generate secure single-use token (32 bytes hex) & 6-digit numeric verification code
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes expiry

    // Save tokenHash, resetCode & expiry to DB and update memory store
    try {
      await pool.query(
        'UPDATE users SET reset_password_token = $1, reset_password_code = $2, reset_password_expires = $3 WHERE id = $4',
        [tokenHash, resetCode, expiresAt, user.id]
      );
    } catch (dbErr) {
      console.warn('[DB NOTICE] Failed to update reset token in DB, using memory sync:', dbErr.message);
    }

    // Keep user in memory store fully synced
    user.reset_password_token = tokenHash;
    user.raw_reset_token = resetToken;
    user.reset_password_code = resetCode;
    user.reset_password_expires = expiresAt;

    const mockMatch = mockUsers.find(u => u.email === normalizedEmail || u.id === user.id);
    if (mockMatch) {
      mockMatch.reset_password_token = tokenHash;
      mockMatch.raw_reset_token = resetToken;
      mockMatch.reset_password_code = resetCode;
      mockMatch.reset_password_expires = expiresAt;
    }

    // Determine frontend URL
    const clientOrigin = req.headers.origin && !req.headers.origin.includes(':5001') ? req.headers.origin : null;
    const frontendBaseUrl = process.env.FRONTEND_URL || clientOrigin || 'http://localhost:5173';
    const resetUrl = `${frontendBaseUrl}/reset-password?token=${resetToken}`;

    // Attempt email delivery via SMTP or Ethereal Mail
    const mailResult = await sendPasswordResetEmail(normalizedEmail, resetUrl, resetCode);
    const { success: emailSent, previewUrl, isEthereal } = mailResult;

    return res.status(200).json({
      success: true,
      emailSent,
      isEthereal: !!isEthereal,
      previewUrl: previewUrl || null,
      resetCode,
      resetToken,
      devResetLink: resetUrl,
      message: genericMsg,
      data: {
        emailSent,
        isEthereal: !!isEthereal,
        previewUrl: previewUrl || null,
        resetCode,
        resetToken,
        devResetLink: resetUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/reset-password
 * Validates single-use token or 6-digit code, updates password hash, and invalidates token.
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token) {
      throw ApiError.badRequest('Invalid or missing password reset token or 6-digit code');
    }

    const cleanToken = token.toString().trim();
    const tokenHash = crypto.createHash('sha256').update(cleanToken).digest('hex');
    let user = null;

    try {
      const dbResult = await pool.query(
        'SELECT * FROM users WHERE (reset_password_token = $1 OR reset_password_token = $2 OR reset_password_code = $3) AND reset_password_expires > CURRENT_TIMESTAMP',
        [tokenHash, cleanToken, cleanToken]
      );
      if (dbResult.rows.length > 0) {
        user = dbResult.rows[0];
      }
    } catch (dbErr) {
      console.warn('[DB NOTICE] Error checking DB for reset token:', dbErr.message);
    }

    if (!user) {
      user = mockUsers.find(
        u => (u.reset_password_token === tokenHash || u.reset_password_token === cleanToken || u.raw_reset_token === cleanToken || u.reset_password_code === cleanToken) &&
             u.reset_password_expires && new Date(u.reset_password_expires) > new Date()
      );
    }

    if (!user) {
      throw ApiError.badRequest('Invalid or expired password reset token / 6-digit code');
    }

    // Hash new password using bcryptjs
    const newPasswordHash = await hashPassword(password);

    // Invalidate reset token & code immediately (single use) and update password hash in DB
    try {
      await pool.query(
        'UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_code = NULL, reset_password_expires = NULL WHERE id = $2',
        [newPasswordHash, user.id]
      );
    } catch (dbErr) {
      console.warn('[DB NOTICE] Failed updating password in DB:', dbErr.message);
    }

    // Always sync memory store
    user.password_hash = newPasswordHash;
    user.reset_password_token = null;
    user.raw_reset_token = null;
    user.reset_password_code = null;
    user.reset_password_expires = null;

    const mockMatch = mockUsers.find(u => u.id === user.id || u.email === user.email);
    if (mockMatch) {
      mockMatch.password_hash = newPasswordHash;
      mockMatch.reset_password_token = null;
      mockMatch.raw_reset_token = null;
      mockMatch.reset_password_code = null;
      mockMatch.reset_password_expires = null;
    }

    console.log(`[Password Reset] Password updated successfully for user ${user.email} (ID ${user.id})`);
    return res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now sign in with your new password.',
      data: null
    });
  } catch (error) {
    next(error);
  }
};




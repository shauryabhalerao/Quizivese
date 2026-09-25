import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

/**
 * Generates a signed JWT session token.
 * @param {object} payload - Data to embed in token (userId, email, role)
 * @returns {string} Signed JWT token string
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

/**
 * Verifies and decodes a JWT token string.
 * @param {string} token - Raw JWT token
 * @returns {object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (err) {
    // Decode Supabase Auth JWT token payload if present
    const decoded = jwt.decode(token);
    if (decoded && (decoded.sub || decoded.userId || decoded.id)) {
      return {
        userId: decoded.sub || decoded.userId || decoded.id,
        email: decoded.email,
        role: decoded.user_metadata?.role || decoded.role || 'student',
        name: decoded.user_metadata?.name || decoded.name || (decoded.email ? decoded.email.split('@')[0] : 'Student')
      };
    }
    throw err;
  }
};

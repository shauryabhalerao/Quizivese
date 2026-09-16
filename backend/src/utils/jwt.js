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
  return jwt.verify(token, config.jwt.secret);
};

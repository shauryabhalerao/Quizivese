import { verifyToken } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Authentication Middleware
 * Validates 'Authorization: Bearer <token>' header and attaches authenticated user.
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authentication token required. Please sign in.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Invalid authorization header format');
    }

    try {
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.userId || decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      };
      next();
    } catch (tokenErr) {
      if (tokenErr.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Session has expired. Please sign in again.');
      }
      throw ApiError.unauthorized('Invalid authentication token');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Role-Based Access Control: Admin Guard
 * Ensures the requesting user has the 'admin' role.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  if (req.user.role !== 'admin') {
    return next(ApiError.forbidden('Access denied: Administrator privileges required'));
  }

  next();
};

/**
 * Optional Authentication Middleware
 * Populates req.user if a valid token exists, but does not reject requests without one.
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.userId || decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      };
    } catch (err) {
      // Ignored for optional auth
    }
  }
  next();
};

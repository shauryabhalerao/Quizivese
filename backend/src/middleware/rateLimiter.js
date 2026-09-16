import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

/**
 * General API Rate Limiter
 * Tuned to handle 100+ concurrent students without false positives.
 * Default: 300 requests per 15-minute window per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,  // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP. Please wait a few moments before trying again.'
    }
  }
});

/**
 * Authentication Route Limiter
 * Tightened to protect against brute-force password guessing.
 * Limit: 25 attempts per 15 minutes.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again after 15 minutes.'
    }
  }
});

/**
 * Quiz Submission Limiter
 * Prevents spamming quiz submission endpoints.
 */
export const quizSubmitLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'SUBMISSION_RATE_LIMIT_EXCEEDED',
      message: 'Submission rate threshold exceeded. Please wait a moment.'
    }
  }
});

/**
 * AI Quiz Generation Limiter
 * Protects external LLM APIs (Gemini/OpenAI) from quota exhaustion and token abuse.
 * Default: 10 generation requests per 15 minutes per IP.
 */
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AI_RATE_LIMIT_EXCEEDED',
      message: 'AI quiz generation limit reached (10 quizzes / 15 mins). Please try again shortly.'
    }
  }
});


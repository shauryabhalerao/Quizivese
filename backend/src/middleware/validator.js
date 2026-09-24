import { ApiError } from '../utils/apiError.js';

/**
 * Strips dangerous HTML tags, inline scripts, event handlers, and javascript: protocols.
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/on\w+\s*=\s*[^>\s]+/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim();
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates student registration input
 */
export const validateRegister = (req, res, next) => {
  const errors = [];
  let { name, email, password, grade } = req.body || {};

  // Sanitize
  if (typeof name === 'string') {
    req.body.name = sanitizeString(name);
    name = req.body.name;
  }
  if (typeof email === 'string') {
    req.body.email = email.trim().toLowerCase();
    email = req.body.email;
  }

  // Name validation
  if (!name || typeof name !== 'string' || name.length < 2 || name.length > 100) {
    errors.push({ field: 'name', message: 'Name must be between 2 and 100 characters' });
  }

  // Email validation
  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address (e.g. student@school.edu)' });
  }

  // Password validation: minimum 6 chars, at least 1 letter and 1 number
  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one letter and one number' });
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Registration validation failed', errors));
  }

  next();
};

/**
 * Validates login input
 */
export const validateLogin = (req, res, next) => {
  const errors = [];
  let { email, password } = req.body || {};

  if (typeof email === 'string') {
    req.body.email = email.trim().toLowerCase();
    email = req.body.email;
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'Valid email address is required' });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Login validation failed', errors));
  }

  next();
};

/**
 * Validates quiz attempt submission
 */
export const validateSubmission = (req, res, next) => {
  const errors = [];
  const { quizId, answers, timeTakenSeconds } = req.body || {};

  if (!quizId || typeof quizId !== 'string' || quizId.trim().length === 0) {
    errors.push({ field: 'quizId', message: 'quizId must be a non-empty string' });
  }

  if (answers !== undefined && (typeof answers !== 'object' || answers === null)) {
    errors.push({ field: 'answers', message: 'answers must be an object or dictionary of selections' });
  }

  if (timeTakenSeconds !== undefined) {
    const time = Number(timeTakenSeconds);
    if (isNaN(time) || time < 0 || time > 14400) {
      errors.push({ field: 'timeTakenSeconds', message: 'timeTakenSeconds must be a valid duration between 0 and 14400 seconds' });
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Quiz submission validation failed', errors));
  }

  next();
};

/**
 * Validates AI quiz generation request
 */
export const validateAiGen = (req, res, next) => {
  const errors = [];
  let { topic, difficulty = 'Medium', numQuestions = 5 } = req.body || {};

  if (typeof topic === 'string') {
    req.body.topic = sanitizeString(topic);
    topic = req.body.topic;
  }

  if (!topic || topic.length < 2 || topic.length > 100) {
    errors.push({ field: 'topic', message: 'Topic must be between 2 and 100 characters' });
  }

  const validDifficulties = ['Easy', 'Medium', 'Hard'];
  if (!validDifficulties.includes(difficulty)) {
    errors.push({ field: 'difficulty', message: `Difficulty must be one of: ${validDifficulties.join(', ')}` });
  }

  const countInput = req.body.numberOfQuestions !== undefined 
    ? req.body.numberOfQuestions 
    : (numQuestions !== undefined ? numQuestions : (req.body.questionCount !== undefined ? req.body.questionCount : 5));
  const qCount = parseInt(countInput, 10);
  if (isNaN(qCount) || qCount < 1 || qCount > 50) {
    errors.push({ field: 'numQuestions', message: 'Question count must be an integer between 1 and 50' });
  } else {
    req.body.numQuestions = qCount;
    req.body.questionCount = qCount;
    req.body.numberOfQuestions = qCount;
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'AI generation validation failed', errors));
  }

  next();
};

/**
 * Validates quiz creation (Admin / Teacher Manual Creator)
 */
export const validateQuizCreate = (req, res, next) => {
  const errors = [];
  let { title, description, category, difficulty = 'Medium', timeLimitMinutes = 10, questions = [] } = req.body || {};

  if (typeof title === 'string') {
    req.body.title = sanitizeString(title);
    title = req.body.title;
  }
  if (typeof description === 'string') {
    req.body.description = sanitizeString(description);
  }

  if (!title || title.length < 3 || title.length > 255) {
    errors.push({ field: 'title', message: 'Title must be between 3 and 255 characters' });
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push({ field: 'category', message: 'Category is required' });
  }

  const validDifficulties = ['Easy', 'Medium', 'Hard'];
  if (!validDifficulties.includes(difficulty)) {
    errors.push({ field: 'difficulty', message: 'Difficulty must be Easy, Medium, or Hard' });
  }

  const limit = parseInt(timeLimitMinutes, 10);
  if (isNaN(limit) || limit < 1 || limit > 180) {
    errors.push({ field: 'timeLimitMinutes', message: 'timeLimitMinutes must be between 1 and 180' });
  }

  if (Array.isArray(questions)) {
    if (questions.length > 100) {
      errors.push({ field: 'questions', message: 'A quiz can have a maximum of 100 questions' });
    }
    if (questions.length === 0) {
      errors.push({ field: 'questions', message: 'At least 1 question is required' });
    }
    if (questions.length > 0) {
      questions.forEach((q, idx) => {
        if (!q.questionText || typeof q.questionText !== 'string' || !q.questionText.trim()) {
          errors.push({ field: `questions[${idx}].questionText`, message: 'Question text is required' });
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          errors.push({ field: `questions[${idx}].options`, message: 'Each question must have exactly 4 options' });
        }
        if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
          errors.push({ field: `questions[${idx}].correctAnswer`, message: 'correctAnswer must be an index between 0 and 3' });
        }
      });
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Quiz creation validation failed', errors));
  }

  next();
};

/**
 * Validates forgot password request input
 */
export const validateForgotPassword = (req, res, next) => {
  const errors = [];
  let { email } = req.body || {};

  if (typeof email === 'string') {
    req.body.email = email.trim().toLowerCase();
    email = req.body.email;
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid registered email address' });
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Forgot password validation failed', errors));
  }

  next();
};

/**
 * Validates reset password request input
 */
export const validateResetPassword = (req, res, next) => {
  const errors = [];
  const { token, password } = req.body || {};

  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    errors.push({ field: 'token', message: 'Reset token is required' });
  }

  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'New password is required' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one letter and one number' });
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Password reset validation failed', errors));
  }

  next();
};


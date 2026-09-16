import { Router } from 'express';
import { submitAttempt, getAttemptById, getUserAttempts } from '../controllers/attempt.controller.js';
import { quizSubmitLimiter } from '../middleware/rateLimiter.js';
import { validateSubmission } from '../middleware/validator.js';

const router = Router();

// Rate-limited and schema-validated attempt submission
router.post('/submit', quizSubmitLimiter, validateSubmission, submitAttempt);
router.get('/user/history', getUserAttempts);
router.get('/:attemptId', getAttemptById);

export default router;

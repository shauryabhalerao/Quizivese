import { Router } from 'express';
import { submitAttempt, getAttemptById, getUserAttempts, getUserStats } from '../controllers/attempt.controller.js';
import { quizSubmitLimiter } from '../middleware/rateLimiter.js';
import { validateSubmission } from '../middleware/validator.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.use(optionalAuth);

// Rate-limited and schema-validated attempt submission
router.post('/submit', quizSubmitLimiter, validateSubmission, submitAttempt);
router.get('/history', getUserAttempts);
router.get('/my-history', getUserAttempts);
router.get('/user/history', getUserAttempts);
router.get('/stats', getUserStats);
router.get('/user/stats', getUserStats);
router.get('/:attemptId', getAttemptById);

export default router;


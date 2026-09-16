import { Router } from 'express';
import { generateAiQuiz, getRecommendations } from '../controllers/ai.controller.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { validateAiGen } from '../middleware/validator.js';

const router = Router();

// Rate-limited and schema-validated AI generation routes
router.post('/generate', aiLimiter, validateAiGen, generateAiQuiz);
router.post('/recommendations', aiLimiter, getRecommendations);

export default router;

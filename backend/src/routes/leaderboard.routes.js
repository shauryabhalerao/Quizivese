import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboard.controller.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/leaderboard?timeframe=global|weekly|monthly
router.get('/', optionalAuth, getLeaderboard);

export default router;

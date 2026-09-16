import { Router } from 'express';
import { getAllAchievements, getUserGamificationStats } from '../controllers/achievement.controller.js';
import { optionalAuth, authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/achievements (Public or user-tailored if token provided)
router.get('/', optionalAuth, getAllAchievements);

// GET /api/achievements/stats (Gamification summary for current user)
router.get('/stats', optionalAuth, getUserGamificationStats);

export default router;

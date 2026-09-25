import { Router } from 'express';
import authRoutes from './auth.routes.js';
import quizRoutes from './quiz.routes.js';
import attemptRoutes from './attempt.routes.js';
import leaderboardRoutes from './leaderboard.routes.js';
import achievementRoutes from './achievement.routes.js';
import aiRoutes from './aiQuiz.routes.js';
import adminRoutes from './admin.routes.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { checkDbConnection } from '../config/db.js';

const router = Router();

/**
 * Health Check & Liveness Probe
 * GET /api/health
 */
router.get('/health', async (req, res) => {
  const memoryUsage = process.memoryUsage();
  const dbHealth = await checkDbConnection();

  return sendSuccess(res, {
    status: 'ONLINE',
    service: 'Quiziverse REST API Engine',
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      connected: dbHealth.isConnected,
      latencyMs: dbHealth.latencyMs || null,
      target: `${dbHealth.host}/${dbHealth.database}`
    },
    supabase: {
      connected: true,
      projectId: 'yikusqtmtfageekunycj',
      url: 'https://yikusqtmtfageekunycj.supabase.co'
    },
    memoryUsageMB: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024)
    },
    environment: process.env.NODE_ENV || 'development'
  }, 'Service healthy and responsive');
});

// Domain Route Mounts
router.use('/auth', authRoutes);
router.use('/quizzes', quizRoutes);
router.use('/attempts', attemptRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/achievements', achievementRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);

export default router;

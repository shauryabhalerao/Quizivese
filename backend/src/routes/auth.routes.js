import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticate } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validator.js';

const router = Router();

// Rate-limited and schema-validated authentication routes
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/me', authenticate, getProfile);

export default router;

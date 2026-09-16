import { Router } from 'express';
import { 
  getAdminStats, 
  getAllUsers, 
  updateUserRole, 
  deleteUser, 
  getAllAttemptsAdmin,
  createQuiz, 
  updateQuiz, 
  deleteQuiz, 
  toggleQuizStatus 
} from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateQuizCreate } from '../middleware/validator.js';

const router = Router();

// Apply authentication and RBAC admin guard to all admin endpoints
router.use(authenticate, requireAdmin);

// Analytics & Audit
router.get('/stats', getAdminStats);
router.get('/attempts', getAllAttemptsAdmin);

// User Role Management
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Quiz Moderation
router.post('/quizzes', validateQuizCreate, createQuiz);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);
router.patch('/quizzes/:id/status', toggleQuizStatus);

export default router;

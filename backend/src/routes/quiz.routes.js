import { Router } from 'express';
import { getAllQuizzes, getQuizById, getCategories, createPublicQuiz } from '../controllers/quiz.controller.js';
import { validateQuizCreate } from '../middleware/validator.js';

const router = Router();

router.get('/', getAllQuizzes);
router.get('/categories', getCategories);
router.get('/:id', getQuizById);
router.post('/', validateQuizCreate, createPublicQuiz);

export default router;

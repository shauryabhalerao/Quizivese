import { Router } from 'express';
import { getAllQuizzes, getQuizById, getCategories } from '../controllers/quiz.controller.js';

const router = Router();

router.get('/', getAllQuizzes);
router.get('/categories', getCategories);
router.get('/:id', getQuizById);

export default router;

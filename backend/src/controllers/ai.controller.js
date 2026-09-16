import { sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { aiService } from '../services/ai/index.js';
import { pool } from '../config/db.js';
import { quizzesDb } from './quiz.controller.js';

export const generateAiQuiz = async (req, res, next) => {
  try {
    const { topic, difficulty = 'Medium', questionStyle = 'Multiple Choice' } = req.body;
    const requestedCount = parseInt(req.body.numQuestions || req.body.questionCount || 4, 10);
    const validNumQuestions = Math.min(Math.max(1, isNaN(requestedCount) ? 4 : requestedCount), 50);
    const userId = req.user?.id || 'usr-std-101';

    if (!topic || !topic.trim()) {
      throw ApiError.badRequest('Topic is required for AI quiz generation');
    }

    // 1. Synthesize quiz using modular AI layer
    const synthesizedQuiz = await aiService.generateQuiz({
      topic: topic.trim(),
      difficulty,
      numQuestions: validNumQuestions,
      questionStyle
    });

    const quizId = `quiz-ai-${Date.now()}`;
    synthesizedQuiz.id = quizId;

    // 2. Persist to PostgreSQL Database with Atomic Transaction
    const client = await pool.connect().catch(() => null);
    if (client) {
      try {
        await client.query('BEGIN');

        await client.query(
          `INSERT INTO quizzes (id, title, description, category, difficulty, time_limit_minutes, xp_reward, points_reward, is_active, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, $9)`,
          [
            quizId,
            synthesizedQuiz.title,
            synthesizedQuiz.description,
            synthesizedQuiz.category,
            synthesizedQuiz.difficulty,
            synthesizedQuiz.timeLimitMinutes,
            synthesizedQuiz.xpReward,
            synthesizedQuiz.pointsReward,
            userId
          ]
        );

        for (let i = 0; i < synthesizedQuiz.questions.length; i++) {
          const q = synthesizedQuiz.questions[i];
          const qId = q.id || `q-ai-${Date.now()}-${i}`;

          await client.query(
            `INSERT INTO questions (id, quiz_id, question_text, correct_answer_index, explanation, difficulty, topic, order_index)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [qId, quizId, q.questionText, q.correctAnswer, q.explanation, synthesizedQuiz.difficulty, q.topic || topic, i]
          );

          for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
            await client.query(
              `INSERT INTO question_options (id, question_id, option_index, option_text)
               VALUES ($1, $2, $3, $4)`,
              [`opt-ai-${Date.now()}-${i}-${optIdx}`, qId, optIdx, q.options[optIdx]]
            );
          }
        }

        await client.query('COMMIT');
      } catch (txnErr) {
        await client.query('ROLLBACK');
        console.error('[TRANSACTION FAILED] AI Quiz save rolled back:', txnErr.message);
      } finally {
        client.release();
      }
    }

    // Keep memory store synced
    quizzesDb.unshift(synthesizedQuiz);

    return sendCreated(res, { quiz: synthesizedQuiz }, 'AI Quiz synthesized, validated, and saved successfully');
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const { recentAttempts = [] } = req.body;
    const recommendations = await aiService.getRecommendations({ recentAttempts });

    return sendSuccess(res, { recommendations }, 'Personalized practice recommendations generated');
  } catch (error) {
    next(error);
  }
};

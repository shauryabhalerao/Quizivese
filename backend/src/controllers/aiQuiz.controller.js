import { sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { geminiService } from '../services/gemini.service.js';
import { pool } from '../config/db.js';
import { quizzesDb } from './quiz.controller.js';

/**
 * AI Quiz Controller
 * Connects frontend AI requests to backend Gemini Service with database persistence.
 */

// 0. AI Status Check (Safe configuration check without exposing credentials)
export const getAiStatus = async (req, res, next) => {
  try {
    const status = geminiService.getStatus();
    return sendSuccess(res, status, 'AI service status retrieved');
  } catch (error) {
    next(error);
  }
};

// 1. Generate Quiz from Topic Prompt
export const generateAiQuiz = async (req, res, next) => {
  try {
    const { topic, difficulty = 'Medium', questionStyle = 'Multiple Choice', category = 'AI Generated', language = 'English', additionalInstructions = '' } = req.body;
    const countInput = req.body.numberOfQuestions || req.body.numQuestions || req.body.questionCount || 5;
    const numberOfQuestions = Math.min(Math.max(1, parseInt(countInput, 10) || 5), 50);
    const userId = req.user?.id || 'usr-std-101';

    if (!topic || !topic.trim()) {
      throw ApiError.badRequest('Topic is required for AI quiz generation');
    }

    const quiz = await geminiService.generateQuiz({
      topic: topic.trim(),
      difficulty,
      numberOfQuestions,
      questionStyle,
      category,
      language,
      additionalInstructions
    });

    await persistQuizToDb(quiz, userId);
    quizzesDb.unshift(quiz);

    return sendCreated(res, { quiz }, `Generated ${quiz.questions.length} questions on "${topic}" successfully`);
  } catch (error) {
    console.error('[AI] Gemini request failed - Error type:', error.name, '| Status:', error.statusCode || 500, '| Message:', error.message);
    next(error);
  }
};

// 2. Generate Quiz from Uploaded PDF Notes, Syllabus, or Handwritten Image Photos
export const generateFromUploads = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    const { notesText = '', topic = '', difficulty = 'Medium', questionType = 'Multiple Choice', category = 'Study Material' } = req.body;
    const countInput = req.body.numberOfQuestions || req.body.numQuestions || req.body.questionCount || 5;
    const numberOfQuestions = Math.min(Math.max(1, parseInt(countInput, 10) || 5), 50);
    const userId = req.user?.id || 'usr-std-101';

    if (files.length === 0 && (!notesText || !notesText.trim()) && (!topic || !topic.trim())) {
      throw ApiError.badRequest('Please upload study files (PDF notes / textbook photos) or provide lecture notes');
    }

    const quiz = await geminiService.generateFromFiles({
      files,
      notesText: notesText.trim(),
      topic: topic.trim(),
      difficulty,
      numberOfQuestions,
      questionType,
      category
    });

    await persistQuizToDb(quiz, userId);
    quizzesDb.unshift(quiz);

    const sourceLabel = files.length > 0 
      ? `${files.length} uploaded ${files.length === 1 ? 'file' : 'files'}` 
      : 'provided notes';

    return sendCreated(res, { quiz }, `Successfully synthesized ${quiz.questions.length} questions from ${sourceLabel}`);
  } catch (error) {
    console.error('[AI Upload] Multimodal request failed - Status:', error.statusCode || 500, '| Message:', error.message);
    next(error);
  }
};

// 3. Ask AI Tutor (Results Page Explanation / Concept Tutor)
export const explainQuestion = async (req, res, next) => {
  try {
    const { 
      questionText, 
      options = [], 
      selectedAnswer = null, 
      correctAnswer = 0, 
      explanation = '', 
      userPrompt = 'Why is this answer correct?' 
    } = req.body;

    if (!questionText || !questionText.trim()) {
      throw ApiError.badRequest('Question text is required for AI Tutor explanation');
    }

    const result = await geminiService.generateExplanation({
      questionText: questionText.trim(),
      options,
      selectedAnswer,
      correctAnswer: Number(correctAnswer) || 0,
      explanation,
      userPrompt: userPrompt.trim()
    });

    return sendSuccess(res, result, 'AI Tutor explanation generated');
  } catch (error) {
    next(error);
  }
};

// 4. Generate Personalized Practice Quiz from Weak Areas
export const generatePersonalized = async (req, res, next) => {
  try {
    const { weakTopics = [], difficulty = 'Medium' } = req.body;
    const countInput = req.body.numberOfQuestions || req.body.numQuestions || req.body.questionCount || 5;
    const numberOfQuestions = Math.min(Math.max(1, parseInt(countInput, 10) || 5), 50);
    const userId = req.user?.id || 'usr-std-101';

    const quiz = await geminiService.generatePersonalizedQuiz({
      weakTopics,
      numberOfQuestions,
      difficulty
    });

    await persistQuizToDb(quiz, userId);
    quizzesDb.unshift(quiz);

    return sendCreated(res, { quiz }, 'Personalized weak areas practice drill synthesized');
  } catch (error) {
    next(error);
  }
};

// 5. Analyze Performance
export const analyzePerformance = async (req, res, next) => {
  try {
    const { attempts = [] } = req.body;
    const analysis = await geminiService.analyzePerformance({ attempts });
    return sendSuccess(res, { analysis }, 'Performance analysis generated');
  } catch (error) {
    next(error);
  }
};

// Helper: Safely persist to PostgreSQL if active
async function persistQuizToDb(quiz, authorId, source = 'AI') {
  const client = await pool.connect().catch(() => null);
  if (!client) return;

  try {
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO quizzes (id, title, description, category, difficulty, time_limit_minutes, xp_reward, points_reward, is_active, source, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, $9, $10)
       ON CONFLICT (id) DO NOTHING`,
      [
        quiz.id,
        quiz.title,
        quiz.description,
        quiz.category,
        quiz.difficulty,
        quiz.timeLimitMinutes,
        quiz.xpReward,
        quiz.pointsReward,
        quiz.source || source,
        authorId
      ]
    );

    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      const qId = q.id || `q-ai-${quiz.id}-${i}`;

      await client.query(
        `INSERT INTO questions (id, quiz_id, question_text, correct_answer_index, explanation, difficulty, topic, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [qId, quiz.id, q.questionText, q.correctAnswer, q.explanation, quiz.difficulty, q.topic, i]
      );

      for (let o = 0; o < q.options.length; o++) {
        await client.query(
          `INSERT INTO question_options (id, question_id, option_index, option_text)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO NOTHING`,
          [`opt-${qId}-${o}`, qId, o, q.options[o]]
        );
      }
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.warn('[DB WRITE NOTICE]: Quiz persisted to active memory store:', err.message);
  } finally {
    client.release();
  }
}

import { sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { pool } from '../config/db.js';
import { quizzesDb } from './quiz.controller.js';
import { gamificationService, MASTER_ACHIEVEMENTS } from '../services/gamification.service.js';

let attemptsDb = [
  {
    attemptId: "att-001",
    quizId: "quiz-web-dev-101",
    quizTitle: "Web Development Fundamentals",
    score: 3,
    totalQuestions: 3,
    correctCount: 3,
    incorrectCount: 0,
    unansweredCount: 0,
    percentage: 100,
    timeTakenSeconds: 140,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    status: "Passed",
    xpEarned: 250,
    pointsEarned: 100,
    topicBreakdown: [
      { topic: "HTML5", total: 1, correct: 1, percentage: 100 },
      { topic: "CSS3", total: 1, correct: 1, percentage: 100 },
      { topic: "JavaScript ES6", total: 1, correct: 1, percentage: 100 }
    ],
    breakdown: [
      {
        questionId: "q-web-1",
        questionText: "Which HTML5 semantic element is best suited to encapsulate an independent, self-contained piece of content?",
        options: ["<div>", "<article>", "<section>", "<aside>"],
        correctAnswer: 1,
        selectedAnswer: 1,
        isCorrect: true,
        isUnanswered: false,
        explanation: "The <article> tag specifies independent, self-contained content that can be distributed independently, such as news articles or blog entries.",
        topic: "HTML5",
        difficulty: "Easy"
      },
      {
        questionId: "q-web-2",
        questionText: "In CSS Flexbox, which property aligns flex items along the cross axis inside the flex container?",
        options: ["justify-content", "align-items", "flex-direction", "align-content"],
        correctAnswer: 1,
        selectedAnswer: 1,
        isCorrect: true,
        isUnanswered: false,
        explanation: "While justify-content aligns along the main axis, align-items controls alignment along the cross axis.",
        topic: "CSS3",
        difficulty: "Easy"
      },
      {
        questionId: "q-web-3",
        questionText: "What is the key difference between let and const declarations in modern ECMAScript?",
        options: [
          "const variables can be reassigned but not redeclared",
          "let is block-scoped while const is function-scoped",
          "const identifiers cannot be reassigned after initialization",
          "let variables are automatically attached to the window object"
        ],
        correctAnswer: 2,
        selectedAnswer: 2,
        isCorrect: true,
        isUnanswered: false,
        explanation: "Variables declared with const cannot be reassigned another value once initialized.",
        topic: "JavaScript ES6",
        difficulty: "Easy"
      }
    ]
  }
];

// In-memory user gamification cache for zero-database fallback
const inMemoryGamificationState = {
  'usr-std-101': {
    points: 2650,
    xp: 4850,
    level: 5,
    currentStreak: 4,
    longestStreak: 7,
    lastActiveAt: new Date(Date.now() - 86400000).toISOString(),
    attemptsCount: 12,
    unlockedCodes: new Set(['FIRST_QUIZ', 'QUIZ_FIVE', 'QUIZ_TEN', 'HIGH_SCORE_90', 'STREAK_3', 'LEVEL_5'])
  }
};

/**
 * Evaluates submitted answers, scores performance, updates daily streaks,
 * calculates level progression, and unlocks milestone achievements.
 */
export const submitAttempt = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'usr-std-101';
    const { quizId, answers = {}, timeTakenSeconds = 0 } = req.body;

    if (!quizId) {
      throw ApiError.badRequest('quizId is required to submit an attempt');
    }

    // 1. Fetch Quiz & Questions (Anti-Cheat Server-Side Resolution)
    let dbQuestions = [];
    let quizTitle = '';
    let xpReward = 300;
    let pointsReward = 100;
    let isAiQuiz = quizId.startsWith('ai-');

    try {
      const qzRes = await pool.query(
        'SELECT id, title, xp_reward, points_reward, category FROM quizzes WHERE id = $1',
        [quizId]
      );
      if (qzRes.rows.length === 0) {
        throw ApiError.notFound(`Quiz '${quizId}' not found`);
      }
      quizTitle = qzRes.rows[0].title;
      xpReward = qzRes.rows[0].xp_reward;
      pointsReward = qzRes.rows[0].points_reward;
      if (qzRes.rows[0].category === 'AI-Generated' || quizTitle.toLowerCase().includes('ai')) {
        isAiQuiz = true;
      }

      const qRes = await pool.query(
        `SELECT q.id, q.question_text AS "questionText", q.correct_answer_index AS "correctAnswer", 
                q.explanation, q.difficulty, q.topic, q.order_index,
                ARRAY_AGG(o.option_text ORDER BY o.option_index) AS options
         FROM questions q
         JOIN question_options o ON q.id = o.question_id
         WHERE q.quiz_id = $1
         GROUP BY q.id, q.question_text, q.correct_answer_index, q.explanation, q.difficulty, q.topic, q.order_index
         ORDER BY q.order_index ASC`,
        [quizId]
      );
      dbQuestions = qRes.rows;
    } catch (e) {
      // In-memory fallback
      const found = quizzesDb.find(q => q.id === quizId);
      if (!found) throw ApiError.notFound(`Quiz '${quizId}' not found`);
      quizTitle = found.title;
      xpReward = found.xpReward || 300;
      pointsReward = found.pointsReward || 100;
      dbQuestions = found.questions;
      if (found.category === 'AI-Generated' || quizTitle.toLowerCase().includes('ai')) {
        isAiQuiz = true;
      }
    }

    if (!dbQuestions.length) {
      throw ApiError.badRequest('The requested quiz has no active questions');
    }

    // 2. Evaluate Student Answers
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    const topicMap = {};

    const breakdown = dbQuestions.map((q, idx) => {
      const selectedOption = answers[idx];
      const isUnanswered = selectedOption === undefined || selectedOption === null;
      const isCorrect = !isUnanswered && selectedOption === q.correctAnswer;

      if (isUnanswered) unansweredCount++;
      else if (isCorrect) correctCount++;
      else incorrectCount++;

      // Compute topic mastery
      const topicName = q.topic || 'General Concepts';
      if (!topicMap[topicName]) {
        topicMap[topicName] = { total: 0, correct: 0 };
      }
      topicMap[topicName].total++;
      if (isCorrect) topicMap[topicName].correct++;

      return {
        questionId: q.id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedAnswer: selectedOption,
        isCorrect,
        isUnanswered,
        explanation: q.explanation || 'Verified conceptual rationale.',
        topic: q.topic,
        difficulty: q.difficulty
      };
    });

    // Formulate topic breakdown list
    const topicBreakdown = Object.entries(topicMap).map(([topic, stats]) => ({
      topic,
      total: stats.total,
      correct: stats.correct,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }));

    const totalQuestions = dbQuestions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const baseXpEarned = Math.round((percentage / 100) * xpReward);
    const basePointsEarned = Math.round((percentage / 100) * pointsReward);
    const attemptId = `att-${Date.now()}`;
    const status = percentage >= 70 ? 'Passed' : 'Needs Practice';

    // 3. GAMIFICATION EVALUATION
    let currentStreak = 1;
    let longestStreak = 1;
    let lastActiveAt = null;
    let currentXp = 200;
    let currentPoints = 100;
    let currentLevel = 1;
    let previousAttemptsCount = 0;
    let unlockedCodes = new Set();

    // Query current user gamification profile from database if available
    const client = await pool.connect().catch(() => null);
    if (client) {
      try {
        const uRes = await client.query(
          'SELECT points, xp, level, current_streak, longest_streak, last_active_at FROM users WHERE id = $1',
          [userId]
        );
        if (uRes.rows.length > 0) {
          const u = uRes.rows[0];
          currentPoints = u.points || 0;
          currentXp = u.xp || 0;
          currentLevel = u.level || 1;
          currentStreak = u.current_streak || 1;
          longestStreak = u.longest_streak || 1;
          lastActiveAt = u.last_active_at;
        }

        const countRes = await client.query(
          'SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1',
          [userId]
        );
        previousAttemptsCount = parseInt(countRes.rows[0].count, 10) || 0;

        const achRes = await client.query(
          `SELECT a.code FROM user_achievements ua
           JOIN achievements a ON ua.achievement_id = a.id
           WHERE ua.user_id = $1 AND ua.is_unlocked = TRUE`,
          [userId]
        );
        unlockedCodes = new Set(achRes.rows.map(r => r.code));
      } catch (dbReadErr) {
        console.warn('[GAMIFICATION DB READ ERROR]:', dbReadErr.message);
      }
    } else {
      // In-memory user state
      const memUser = inMemoryGamificationState[userId] || {
        points: 2650,
        xp: 4850,
        level: 5,
        currentStreak: 4,
        longestStreak: 7,
        lastActiveAt: new Date(Date.now() - 86400000).toISOString(),
        attemptsCount: 12,
        unlockedCodes: new Set(['FIRST_QUIZ', 'QUIZ_FIVE', 'QUIZ_TEN', 'HIGH_SCORE_90', 'STREAK_3', 'LEVEL_5'])
      };
      currentPoints = memUser.points;
      currentXp = memUser.xp;
      currentLevel = memUser.level;
      currentStreak = memUser.currentStreak;
      longestStreak = memUser.longestStreak;
      lastActiveAt = memUser.lastActiveAt;
      previousAttemptsCount = memUser.attemptsCount;
      unlockedCodes = new Set(memUser.unlockedCodes);
    }

    // A. Evaluate Daily Streak
    const streakResult = gamificationService.evaluateStreak(
      currentStreak,
      longestStreak,
      lastActiveAt,
      new Date()
    );

    // B. Evaluate Achievements & Badges
    const achievementEvaluation = gamificationService.evaluateAchievements({
      unlockedCodes,
      attemptCount: previousAttemptsCount + 1,
      currentStreak: streakResult.currentStreak,
      currentLevel,
      attemptPercentage: percentage,
      timeTakenSeconds: Math.max(1, timeTakenSeconds),
      isAiQuiz
    });

    const bonusXp = achievementEvaluation.bonusXp;
    const totalXpEarned = baseXpEarned + bonusXp;
    const totalPointsEarned = basePointsEarned;

    // C. Calculate Level Progression
    const newTotalXp = currentXp + totalXpEarned;
    const newTotalPoints = currentPoints + totalPointsEarned;
    const levelResult = gamificationService.calculateLevel(newTotalXp, currentXp);

    const newAttempt = {
      attemptId,
      quizId,
      quizTitle,
      score: correctCount,
      totalQuestions,
      correctCount,
      incorrectCount,
      unansweredCount,
      percentage,
      timeTakenSeconds: Math.max(1, timeTakenSeconds),
      completedAt: new Date().toISOString(),
      status,
      xpEarned: totalXpEarned,
      pointsEarned: totalPointsEarned,
      topicBreakdown,
      breakdown
    };

    // 4. ATOMIC DATABASE PERSISTENCE
    if (client) {
      try {
        await client.query('BEGIN');

        // Record attempt
        await client.query(
          `INSERT INTO quiz_attempts 
           (id, user_id, quiz_id, score, total_questions, correct_count, incorrect_count, unanswered_count, percentage, time_taken_seconds, status, xp_earned, points_earned)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [attemptId, userId, quizId, correctCount, totalQuestions, correctCount, incorrectCount, unansweredCount, percentage, timeTakenSeconds, status, totalXpEarned, totalPointsEarned]
        );

        // Record answers
        for (const item of breakdown) {
          await client.query(
            `INSERT INTO attempt_answers (id, attempt_id, question_id, selected_option_index, is_correct)
             VALUES ($1, $2, $3, $4, $5)`,
            [`ans-${Date.now()}-${item.questionId}`, attemptId, item.questionId, item.selectedAnswer ?? null, item.isCorrect]
          );
        }

        // Update User Gamification Stats
        await client.query(
          `UPDATE users 
           SET points = $1,
               xp = $2,
               level = $3,
               current_streak = $4,
               longest_streak = $5,
               last_active_at = CURRENT_TIMESTAMP
           WHERE id = $6`,
          [newTotalPoints, newTotalXp, levelResult.level, streakResult.currentStreak, streakResult.longestStreak, userId]
        );

        await client.query('UPDATE quizzes SET total_attempts = total_attempts + 1 WHERE id = $1', [quizId]);

        // Upsert newly unlocked achievements
        for (const ach of achievementEvaluation.newlyUnlocked) {
          await client.query(
            `INSERT INTO user_achievements (id, user_id, achievement_id, progress, is_unlocked, unlocked_at)
             VALUES ($1, $2, $3, $4, TRUE, CURRENT_TIMESTAMP)
             ON CONFLICT (user_id, achievement_id) 
             DO UPDATE SET is_unlocked = TRUE, unlocked_at = CURRENT_TIMESTAMP, progress = EXCLUDED.progress`,
            [`uach-${Date.now()}-${ach.id}`, userId, ach.id, ach.maxProgress]
          );
        }

        await client.query('COMMIT');
      } catch (txnErr) {
        await client.query('ROLLBACK');
        console.error('[TRANSACTION FAILED] Attempt rollback:', txnErr.message);
      } finally {
        client.release();
      }
    } else {
      // Update in-memory user cache
      const memUser = inMemoryGamificationState[userId] || {};
      memUser.points = newTotalPoints;
      memUser.xp = newTotalXp;
      memUser.level = levelResult.level;
      memUser.currentStreak = streakResult.currentStreak;
      memUser.longestStreak = streakResult.longestStreak;
      memUser.lastActiveAt = new Date().toISOString();
      memUser.attemptsCount = previousAttemptsCount + 1;
      achievementEvaluation.newlyUnlocked.forEach(a => memUser.unlockedCodes.add(a.code));
      inMemoryGamificationState[userId] = memUser;
    }

    attemptsDb.unshift(newAttempt);

    const gamificationPayload = {
      pointsEarned: totalPointsEarned,
      xpEarned: totalXpEarned,
      baseXp: baseXpEarned,
      bonusXp,
      totalPoints: newTotalPoints,
      totalXp: newTotalXp,
      streak: streakResult,
      level: levelResult,
      newlyUnlockedBadges: achievementEvaluation.newlyUnlocked
    };

    return sendCreated(res, {
      attempt: newAttempt,
      gamification: gamificationPayload
    }, 'Quiz evaluated and scored successfully');
  } catch (error) {
    next(error);
  }
};

export const getAttemptById = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    let attempt = null;

    try {
      const attRes = await pool.query(
        `SELECT a.id AS "attemptId", a.quiz_id AS "quizId", q.title AS "quizTitle",
                a.score, a.total_questions AS "totalQuestions", a.correct_count AS "correctCount",
                a.incorrect_count AS "incorrectCount", a.unanswered_count AS "unansweredCount",
                a.percentage, a.time_taken_seconds AS "timeTakenSeconds", a.status,
                a.xp_earned AS "xpEarned", a.points_earned AS "pointsEarned", a.completed_at AS "completedAt"
         FROM quiz_attempts a
         JOIN quizzes q ON a.quiz_id = q.id
         WHERE a.id = $1`,
        [attemptId]
      );

      if (attRes.rows.length > 0) {
        attempt = attRes.rows[0];

        const ansRes = await pool.query(
          `SELECT aa.question_id AS "questionId", qs.question_text AS "questionText",
                  qs.correct_answer_index AS "correctAnswer", qs.explanation, qs.topic, qs.difficulty,
                  aa.selected_option_index AS "selectedAnswer", aa.is_correct AS "isCorrect",
                  ARRAY_AGG(o.option_text ORDER BY o.option_index) AS options
           FROM attempt_answers aa
           JOIN questions qs ON aa.question_id = qs.id
           JOIN question_options o ON qs.id = o.question_id
           WHERE aa.attempt_id = $1
           GROUP BY aa.question_id, qs.question_text, qs.correct_answer_index, qs.explanation, qs.topic, qs.difficulty, aa.selected_option_index, aa.is_correct
           ORDER BY qs.order_index ASC`,
          [attemptId]
        );

        attempt.breakdown = ansRes.rows.map(r => ({
          ...r,
          isUnanswered: r.selectedAnswer === null || r.selectedAnswer === undefined
        }));

        // Compute topic breakdown
        const topicMap = {};
        attempt.breakdown.forEach(item => {
          const t = item.topic || 'General';
          if (!topicMap[t]) topicMap[t] = { total: 0, correct: 0 };
          topicMap[t].total++;
          if (item.isCorrect) topicMap[t].correct++;
        });

        attempt.topicBreakdown = Object.entries(topicMap).map(([topic, stats]) => ({
          topic,
          total: stats.total,
          correct: stats.correct,
          percentage: Math.round((stats.correct / stats.total) * 100)
        }));
      }
    } catch (e) {
      attempt = attemptsDb.find(a => a.attemptId === attemptId);
    }

    if (!attempt) {
      throw ApiError.notFound(`Attempt record '${attemptId}' not found`);
    }

    return sendSuccess(res, { attempt }, 'Attempt details and explanations retrieved');
  } catch (error) {
    next(error);
  }
};

export const getUserAttempts = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'usr-std-101';
    let attempts = [];

    try {
      const dbRes = await pool.query(
        `SELECT a.id AS "attemptId", a.quiz_id AS "quizId", q.title AS "quizTitle",
                a.score, a.total_questions AS "totalQuestions", a.percentage,
                a.time_taken_seconds AS "timeTakenSeconds", a.status,
                a.xp_earned AS "xpEarned", a.points_earned AS "pointsEarned", a.completed_at AS "completedAt"
         FROM quiz_attempts a
         JOIN quizzes q ON a.quiz_id = q.id
         WHERE a.user_id = $1
         ORDER BY a.completed_at DESC`,
        [userId]
      );
      attempts = dbRes.rows;
    } catch (e) {
      attempts = attemptsDb;
    }

    return sendSuccess(res, { attempts }, 'User attempt history retrieved');
  } catch (error) {
    next(error);
  }
};

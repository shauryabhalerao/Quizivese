import { ApiError } from '../../utils/apiError.js';

/**
 * Strict AI Quiz Schema & Single-Answer Validator
 * Ensures generated questions conform strictly to the required platform specifications:
 * - Exactly 4 options per question.
 * - Exactly 1 correct answer designated (index 0, 1, 2, or 3).
 * - Non-empty question prompt and explanation.
 */
export const validateAiQuiz = (quizData, requestedTopic, requestedDifficulty) => {
  if (!quizData || typeof quizData !== 'object') {
    throw ApiError.unprocessable('AI response could not be parsed as a valid quiz object');
  }

  const title = (quizData.title || `AI: ${requestedTopic}`).trim();
  const description = (quizData.description || `Assessment on ${requestedTopic} with ${requestedDifficulty} difficulty grading.`).trim();
  const category = quizData.category || 'AI Generated';
  const difficulty = ['Easy', 'Medium', 'Hard'].includes(quizData.difficulty) 
    ? quizData.difficulty 
    : requestedDifficulty || 'Medium';

  const rawQuestions = Array.isArray(quizData.questions) ? quizData.questions : [];

  if (rawQuestions.length === 0) {
    throw ApiError.unprocessable('AI failed to generate any questions for the requested topic');
  }

  const validatedQuestions = rawQuestions.map((q, idx) => {
    const questionText = (q.questionText || q.question || '').trim();
    if (!questionText) {
      throw ApiError.unprocessable(`Question #${idx + 1} has an empty question prompt`);
    }

    const rawOptions = Array.isArray(q.options) ? q.options : [];
    if (rawOptions.length !== 4) {
      throw ApiError.unprocessable(`Question #${idx + 1} must have exactly 4 options. Found: ${rawOptions.length}`);
    }

    const options = rawOptions.map((opt, oIdx) => {
      const text = String(opt).trim();
      if (!text) {
        throw ApiError.unprocessable(`Option #${oIdx + 1} on Question #${idx + 1} is empty`);
      }
      return text;
    });

    // Validate correct answer index (must be integer 0 to 3)
    let correctAnswer = q.correctAnswer !== undefined ? q.correctAnswer : q.correct_answer_index;
    if (typeof correctAnswer === 'string') {
      // Handle letter representation e.g. "A" -> 0, "B" -> 1
      const letterMap = { A: 0, B: 1, C: 2, D: 3, a: 0, b: 1, c: 2, d: 3 };
      correctAnswer = letterMap[correctAnswer] !== undefined ? letterMap[correctAnswer] : parseInt(correctAnswer, 10);
    }

    if (correctAnswer === undefined || isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
      throw ApiError.unprocessable(`Question #${idx + 1} has an invalid correct answer index (${correctAnswer}). Must be 0, 1, 2, or 3`);
    }

    const explanation = (q.explanation || `The correct option is choice ${['A', 'B', 'C', 'D'][correctAnswer]}.`).trim();
    const topic = (q.topic || requestedTopic || 'Core Concept').trim();

    return {
      id: `ai-q-${Date.now()}-${idx}`,
      questionText,
      options,
      correctAnswer,
      explanation,
      difficulty,
      topic,
      order_index: idx
    };
  });

  const timeLimitMinutes = Math.min(Math.max(5, validatedQuestions.length * 2), 60);
  const xpReward = validatedQuestions.length * 75;
  const pointsReward = validatedQuestions.length * 30;

  return {
    title,
    description,
    category,
    difficulty,
    timeLimitMinutes,
    xpReward,
    pointsReward,
    questions: validatedQuestions
  };
};

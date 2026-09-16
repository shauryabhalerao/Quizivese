import { sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { pool } from '../config/db.js';

// Central in-memory fallback store when running without a local Postgres instance
export let quizzesDb = [
  {
    id: "quiz-web-dev-101",
    title: "Web Development Fundamentals",
    description: "Test your mastery over modern HTML5 semantic markup, CSS3 layouts, and modern JavaScript ES6+ features.",
    category: "Computer Science",
    difficulty: "Easy",
    timeLimitMinutes: 10,
    xpReward: 250,
    pointsReward: 100,
    isActive: true,
    totalAttempts: 342,
    questions: [
      {
        id: "q-web-1",
        questionText: "Which HTML5 semantic element is best suited to encapsulate an independent, self-contained piece of content?",
        options: ["<div>", "<article>", "<section>", "<aside>"],
        correctAnswer: 1,
        explanation: "The <article> tag specifies independent, self-contained content that can be distributed independently.",
        difficulty: "Easy",
        topic: "HTML5"
      },
      {
        id: "q-web-2",
        questionText: "In CSS Flexbox, which property aligns flex items along the cross axis inside the flex container?",
        options: ["justify-content", "align-items", "flex-direction", "align-content"],
        correctAnswer: 1,
        explanation: "While 'justify-content' aligns items along the main axis, 'align-items' controls alignment along the cross axis.",
        difficulty: "Easy",
        topic: "CSS3"
      },
      {
        id: "q-web-3",
        questionText: "What is the key difference between 'let' and 'const' declarations in modern ECMAScript?",
        options: [
          "'const' variables can be reassigned but not redeclared",
          "'let' is block-scoped while 'const' is function-scoped",
          "'const' identifiers cannot be reassigned after initialization",
          "'let' variables are automatically attached to the window object"
        ],
        correctAnswer: 2,
        explanation: "Variables declared with 'const' cannot be reassigned another value.",
        difficulty: "Easy",
        topic: "JavaScript ES6"
      }
    ]
  },
  {
    id: "quiz-python-ds",
    title: "Python Data Structures & Algorithms",
    description: "Challenge your algorithmic thinking with time complexity, Python built-in structures, and recursion.",
    category: "Algorithms",
    difficulty: "Medium",
    timeLimitMinutes: 12,
    xpReward: 400,
    pointsReward: 180,
    isActive: true,
    totalAttempts: 189,
    questions: [
      {
        id: "q-py-1",
        questionText: "What is the average time complexity for searching a key in a standard Python dictionary?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctAnswer: 2,
        explanation: "Python dictionaries use hash tables internally, providing O(1) average time complexity for lookups.",
        difficulty: "Medium",
        topic: "Data Structures"
      },
      {
        id: "q-py-2",
        questionText: "Which of the following Python data types is immutable?",
        options: ["list", "dict", "set", "tuple"],
        correctAnswer: 3,
        explanation: "Tuples are immutable sequences in Python; once created, their elements cannot be changed.",
        difficulty: "Medium",
        topic: "Python Core"
      }
    ]
  },
  {
    id: "quiz-ai-gen",
    title: "Artificial Intelligence & Neural Networks",
    description: "Explore foundations of machine learning, loss functions, transformers, and deep learning architectures.",
    category: "AI & ML",
    difficulty: "Hard",
    timeLimitMinutes: 15,
    xpReward: 600,
    pointsReward: 300,
    isActive: true,
    totalAttempts: 124,
    questions: [
      {
        id: "q-ai-1",
        questionText: "What mechanism is central to the architecture of Transformer models like GPT and BERT?",
        options: ["Recurrent Gate Units", "Self-Attention Mechanism", "Convolutional Pooling", "Genetic Algorithm Mutation"],
        correctAnswer: 1,
        explanation: "Self-attention allows transformers to compute dependencies between all tokens in a sequence concurrently.",
        difficulty: "Hard",
        topic: "Transformers"
      }
    ]
  }
];

export const getAllQuizzes = async (req, res, next) => {
  try {
    const { search = '', category = 'All', difficulty = 'All', page = 1, limit = 10 } = req.query;

    let quizzes = [];
    let totalCount = 0;

    try {
      let sql = `
        SELECT q.id, q.title, q.description, q.category, q.difficulty, 
               q.time_limit_minutes AS "timeLimitMinutes", 
               q.xp_reward AS "xpReward", 
               q.points_reward AS "pointsReward", 
               q.is_active AS "isActive", 
               q.total_attempts AS "totalAttempts",
               COUNT(DISTINCT qs.id)::int AS "questionCount"
        FROM quizzes q
        LEFT JOIN questions qs ON q.id = qs.quiz_id
        WHERE q.is_active = TRUE
      `;
      const params = [];

      if (search) {
        params.push(`%${search.toLowerCase()}%`);
        sql += ` AND (LOWER(q.title) LIKE $${params.length} OR LOWER(q.description) LIKE $${params.length})`;
      }

      if (category && category !== 'All') {
        params.push(category);
        sql += ` AND q.category = $${params.length}`;
      }

      if (difficulty && difficulty !== 'All') {
        params.push(difficulty);
        sql += ` AND LOWER(q.difficulty) = LOWER($${params.length})`;
      }

      sql += ` GROUP BY q.id ORDER BY q.created_at DESC`;

      const dbResult = await pool.query(sql, params);
      quizzes = dbResult.rows;
      totalCount = quizzes.length;

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const startIndex = (pageNum - 1) * limitNum;
      quizzes = quizzes.slice(startIndex, startIndex + limitNum);

      return sendPaginated(res, quizzes, totalCount, pageNum, limitNum, 'Quizzes fetched from database');
    } catch (dbErr) {
      // Fallback to in-memory store
      let filtered = quizzesDb.filter(q => q.isActive);

      if (search) {
        const qLower = search.toLowerCase();
        filtered = filtered.filter(q => 
          q.title.toLowerCase().includes(qLower) || 
          q.description.toLowerCase().includes(qLower)
        );
      }

      if (category && category !== 'All') {
        filtered = filtered.filter(q => q.category === category);
      }

      if (difficulty && difficulty !== 'All') {
        filtered = filtered.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
      }

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const startIndex = (pageNum - 1) * limitNum;
      const paginated = filtered.slice(startIndex, startIndex + limitNum);

      return sendPaginated(res, paginated, filtered.length, pageNum, limitNum, 'Quizzes fetched successfully');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get Quiz by ID (With Anti-Cheat Question Sanitization)
 * Strips correct answers and explanations during quiz-taking to prevent client devtools cheating!
 */
export const getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let quiz = null;

    try {
      const quizRes = await pool.query(
        `SELECT id, title, description, category, difficulty, 
                time_limit_minutes AS "timeLimitMinutes", 
                xp_reward AS "xpReward", 
                points_reward AS "pointsReward", 
                is_active AS "isActive"
         FROM quizzes WHERE id = $1`,
        [id]
      );

      if (quizRes.rows.length === 0) {
        throw ApiError.notFound(`Quiz '${id}' not found`);
      }

      quiz = quizRes.rows[0];

      // Fetch questions and options
      const questionsRes = await pool.query(
        `SELECT q.id, q.question_text AS "questionText", q.difficulty, q.topic, q.order_index,
                ARRAY_AGG(o.option_text ORDER BY o.option_index) AS options
         FROM questions q
         JOIN question_options o ON q.id = o.question_id
         WHERE q.quiz_id = $1
         GROUP BY q.id, q.question_text, q.difficulty, q.topic, q.order_index
         ORDER BY q.order_index ASC`,
        [id]
      );

      // Questions returned with zero answer leak
      quiz.questions = questionsRes.rows;
    } catch (dbErr) {
      if (dbErr.statusCode === 404) throw dbErr;

      // In-memory fallback
      const found = quizzesDb.find(q => q.id === id);
      if (!found) {
        throw ApiError.notFound(`Quiz '${id}' not found`);
      }

      // Sanitize: clone and strip correct answers and explanations for anti-cheat
      quiz = {
        ...found,
        questions: found.questions.map(q => ({
          id: q.id,
          questionText: q.questionText,
          options: q.options,
          difficulty: q.difficulty,
          topic: q.topic
          // correctAnswer and explanation intentionally omitted!
        }))
      };
    }

    return sendSuccess(res, { quiz }, 'Quiz details retrieved (anti-cheat sanitized)');
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    let categories = [];
    try {
      const catRes = await pool.query('SELECT DISTINCT category FROM quizzes WHERE is_active = TRUE ORDER BY category ASC');
      categories = ['All', ...catRes.rows.map(r => r.category)];
    } catch (e) {
      categories = ['All', ...new Set(quizzesDb.map(q => q.category))];
    }

    return sendSuccess(res, { categories }, 'Categories fetched');
  } catch (error) {
    next(error);
  }
};

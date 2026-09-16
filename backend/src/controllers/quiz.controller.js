import { sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { pool } from '../config/db.js';

// Central in-memory fallback store when running without a local Postgres instance
export let quizzesDb = [
  {
    id: "quiz-web-dev-101",
    title: "Web Development Fundamentals",
    description: "Master modern HTML5 semantics, CSS Flexbox/Grid, responsive UI paradigms, and modern ES6+ JavaScript.",
    category: "Web Development",
    difficulty: "Easy",
    timeLimitMinutes: 10,
    xpReward: 300,
    pointsReward: 120,
    isActive: true,
    isFeatured: true,
    isPopular: true,
    totalAttempts: 342,
    questions: [
      {
        id: "q-web-1",
        questionText: "Which HTML5 semantic element is best suited to encapsulate an independent, self-contained piece of content?",
        options: ["<div>", "<article>", "<section>", "<aside>"],
        correctAnswer: 1,
        explanation: "The <article> tag specifies independent, self-contained content that can be distributed independently, such as a forum post or news article.",
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
        explanation: "Variables declared with 'const' cannot be reassigned another value. Both 'let' and 'const' are block-scoped.",
        difficulty: "Easy",
        topic: "JavaScript ES6"
      },
      {
        id: "q-web-4",
        questionText: "Which HTTP status code signifies that the requested resource was not found on the server?",
        options: ["401 Unauthorized", "403 Forbidden", "404 Not Found", "500 Internal Server Error"],
        correctAnswer: 2,
        explanation: "HTTP 404 indicates that the server cannot locate the requested resource.",
        difficulty: "Easy",
        topic: "HTTP Protocols"
      },
      {
        id: "q-web-5",
        questionText: "Which JavaScript method returns a new array populated with the results of calling a provided callback on every element?",
        options: ["Array.prototype.filter()", "Array.prototype.forEach()", "Array.prototype.map()", "Array.prototype.reduce()"],
        correctAnswer: 2,
        explanation: "map() executes a callback for each element and builds a new array of matching length containing the callback return values.",
        difficulty: "Easy",
        topic: "JavaScript Arrays"
      }
    ]
  },
  {
    id: "quiz-programming-core",
    title: "Programming Core & OOP Concepts",
    description: "Deep dive into object-oriented principles, polymorphism, memory paradigms, and functional patterns in modern languages.",
    category: "Programming",
    difficulty: "Medium",
    timeLimitMinutes: 12,
    xpReward: 420,
    pointsReward: 160,
    isActive: true,
    isPopular: true,
    totalAttempts: 275,
    questions: [
      {
        id: "pr1",
        questionText: "Which OOP principle allows a single interface to represent different underlying forms (data types or classes)?",
        options: ["Encapsulation", "Polymorphism", "Abstraction", "Inheritance"],
        correctAnswer: 1,
        explanation: "Polymorphism allows methods or operators to perform different tasks based on the object invoking them.",
        difficulty: "Medium",
        topic: "OOP Fundamentals"
      },
      {
        id: "pr2",
        questionText: "In memory management, where are local variables and function call frames allocated during program execution?",
        options: ["Heap", "Call Stack", "Static Segment", "Register File"],
        correctAnswer: 1,
        explanation: "The Stack memory stores active stack frames containing local variables, return pointers, and function invocation states in LIFO order.",
        difficulty: "Medium",
        topic: "Memory Management"
      },
      {
        id: "pr3",
        questionText: "What distinguishes a pure function in functional programming paradigms?",
        options: [
          "It must use asynchronous callbacks",
          "It always returns undefined unless explicitly returned",
          "Given the same arguments, it always returns the same output with zero side effects",
          "It mutates global variables to conserve memory"
        ],
        correctAnswer: 2,
        explanation: "Pure functions produce deterministic output solely determined by input parameters without altering external system state.",
        difficulty: "Medium",
        topic: "Functional Programming"
      }
    ]
  },
  {
    id: "quiz-dsa-mastery",
    title: "Data Structures & Algorithmic Thinking",
    description: "Challenge yourself with time complexities, binary search trees, hash table collisions, and graph traversal algorithms.",
    category: "DSA",
    difficulty: "Hard",
    timeLimitMinutes: 15,
    xpReward: 550,
    pointsReward: 220,
    isActive: true,
    isFeatured: true,
    isPopular: true,
    totalAttempts: 412,
    questions: [
      {
        id: "dsa1",
        questionText: "What is the average time complexity of searching for a key in a well-balanced Hash Table?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctAnswer: 2,
        explanation: "Under uniform hashing, Hash Tables provide constant O(1) average time complexity for lookups, insertions, and deletions.",
        difficulty: "Medium",
        topic: "Hash Tables"
      },
      {
        id: "dsa2",
        questionText: "Which graph traversal algorithm uses a Queue (FIFO) and explores neighbors layer-by-layer?",
        options: ["Depth First Search (DFS)", "Breadth First Search (BFS)", "Dijkstra's with Stack", "Bellman-Ford"],
        correctAnswer: 1,
        explanation: "BFS systematically visits all vertices at current depth before proceeding deeper, using a FIFO queue.",
        difficulty: "Medium",
        topic: "Graph Traversal"
      },
      {
        id: "dsa3",
        questionText: "What is the worst-case time complexity of QuickSort when bad pivot selection occurs?",
        options: ["O(n log n)", "O(n)", "O(n^2)", "O(2^n)"],
        correctAnswer: 2,
        explanation: "When partitions are maximally unbalanced (e.g. smallest/largest element consistently chosen), QuickSort degrades to O(n^2).",
        difficulty: "Hard",
        topic: "Sorting Algorithms"
      }
    ]
  },
  {
    id: "quiz-aptitude-quant",
    title: "Quantitative Aptitude & Logical Reasoning",
    description: "Sharpen your analytical problem solving with probability, percentages, speed-distance-time, and logic puzzles.",
    category: "Aptitude",
    difficulty: "Medium",
    timeLimitMinutes: 10,
    xpReward: 350,
    pointsReward: 140,
    isActive: true,
    isPopular: true,
    totalAttempts: 520,
    questions: [
      {
        id: "apt1",
        questionText: "A train running at 72 km/h crosses a 200-meter platform in 20 seconds. What is the length of the train?",
        options: ["180 meters", "200 meters", "220 meters", "240 meters"],
        correctAnswer: 1,
        explanation: "Speed = 72 * (5/18) = 20 m/s. Total distance in 20s = 20 * 20 = 400m. Train length = 400 - 200 = 200 meters.",
        difficulty: "Medium",
        topic: "Speed, Distance & Time"
      },
      {
        id: "apt2",
        questionText: "If two unbiased fair dice are rolled simultaneously, what is the probability that the sum of the numbers is 7?",
        options: ["1/12", "1/6", "5/36", "7/36"],
        correctAnswer: 1,
        explanation: "Combinations summing to 7 are: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 combinations. Total outcomes = 36. Probability = 6/36 = 1/6.",
        difficulty: "Medium",
        topic: "Probability"
      },
      {
        id: "apt3",
        questionText: "Complete the series: 3, 7, 15, 31, 63, ___?",
        options: ["95", "127", "128", "131"],
        correctAnswer: 1,
        explanation: "The pattern is (2 * x) + 1: (3*2)+1=7, (7*2)+1=15, (15*2)+1=31, (31*2)+1=63, (63*2)+1 = 127.",
        difficulty: "Easy",
        topic: "Number Series"
      }
    ]
  },
  {
    id: "quiz-general-knowledge",
    title: "Daily World Trivia & General Knowledge",
    description: "Global geography, monumental historical events, scientific milestones, and world culture.",
    category: "General Knowledge",
    difficulty: "Easy",
    timeLimitMinutes: 8,
    xpReward: 320,
    pointsReward: 130,
    isActive: true,
    isDaily: true,
    isFeatured: true,
    totalAttempts: 680,
    questions: [
      {
        id: "gk1",
        questionText: "Which is the largest ocean on Earth covering more than 30% of the planet's surface?",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
        correctAnswer: 2,
        explanation: "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions, spanning approximately 165 million square kilometers.",
        difficulty: "Easy",
        topic: "Geography"
      },
      {
        id: "gk2",
        questionText: "Who is credited with inventing the World Wide Web at CERN in 1989?",
        options: ["Alan Turing", "Tim Berners-Lee", "Vint Cerf", "Steve Wozniak"],
        correctAnswer: 1,
        explanation: "Sir Tim Berners-Lee invented the World Wide Web in 1989 while working as a computer scientist at CERN.",
        difficulty: "Easy",
        topic: "Inventions & Tech History"
      },
      {
        id: "gk3",
        questionText: "Which planet in our solar system has the highest number of confirmed moons as of recent astronomical surveys?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correctAnswer: 1,
        explanation: "Saturn holds the official lead with over 140 confirmed natural satellites recognized by the IAU.",
        difficulty: "Easy",
        topic: "Solar System"
      }
    ]
  },
  {
    id: "quiz-science-physics-chem",
    title: "Physics, Chemistry & Space Exploration",
    description: "Explore atomic structures, thermodynamics, universal gravitation, and interstellar discoveries.",
    category: "Science",
    difficulty: "Medium",
    timeLimitMinutes: 10,
    xpReward: 380,
    pointsReward: 150,
    isActive: true,
    isPopular: true,
    totalAttempts: 210,
    questions: [
      {
        id: "sci1",
        questionText: "What fundamental constant connects the energy of a photon to its electromagnetic frequency (E = h * f)?",
        options: ["Boltzmann's Constant", "Planck's Constant", "Avogadro's Number", "Universal Gas Constant"],
        correctAnswer: 1,
        explanation: "Planck's constant (h ≈ 6.626 × 10^-34 J·s) quantizes the proportional relationship between photon energy and wave frequency.",
        difficulty: "Medium",
        topic: "Quantum Physics"
      },
      {
        id: "sci2",
        questionText: "Which element has the highest electrical conductivity of all metals at room temperature?",
        options: ["Copper", "Gold", "Silver", "Aluminum"],
        correctAnswer: 2,
        explanation: "Silver possesses the highest electrical conductivity of any element, followed by copper and gold.",
        difficulty: "Medium",
        topic: "Chemistry & Materials"
      }
    ]
  },
  {
    id: "quiz-ai-gen",
    title: "Artificial Intelligence & Neural Networks",
    description: "Explore foundations of machine learning, loss functions, transformers, and deep learning architectures.",
    category: "Artificial Intelligence",
    difficulty: "Hard",
    timeLimitMinutes: 15,
    xpReward: 600,
    pointsReward: 250,
    isActive: true,
    isFeatured: true,
    totalAttempts: 310,
    questions: [
      {
        id: "ai1",
        questionText: "What mechanism is central to the architecture of Transformer models like GPT and BERT?",
        options: [
          "Recurrent Gate Units (GRU)",
          "Self-Attention Mechanism",
          "Convolutional Pooling",
          "Genetic Algorithm Mutation"
        ],
        correctAnswer: 1,
        explanation: "Self-attention allows transformers to compute dependencies between all tokens in a sequence concurrently without sequential recurrence.",
        difficulty: "Hard",
        topic: "Transformers"
      },
      {
        id: "ai2",
        questionText: "Which activation function is most prone to the 'Vanishing Gradient' problem in very deep neural networks?",
        options: ["ReLU", "Leaky ReLU", "Sigmoid", "GELU"],
        correctAnswer: 2,
        explanation: "The derivative of the Sigmoid function caps at 0.25. Multiplying many values < 1 during backpropagation causes gradients to vanish exponentially.",
        difficulty: "Hard",
        topic: "Deep Learning"
      },
      {
        id: "ai3",
        questionText: "In supervised learning, what term describes a model that performs well on training data but poorly on unseen test data?",
        options: ["Underfitting", "Overfitting", "High Bias", "Regularization"],
        correctAnswer: 1,
        explanation: "Overfitting occurs when a model memorizes noise in the training set rather than learning generalizable features.",
        difficulty: "Hard",
        topic: "Model Evaluation"
      }
    ]
  },
  {
    id: "quiz-sql-databases",
    title: "SQL & Relational Database Mastery",
    description: "Master table JOINs, aggregations, indexing strategies, transactions (ACID), and schema constraints.",
    category: "SQL",
    difficulty: "Medium",
    timeLimitMinutes: 12,
    xpReward: 420,
    pointsReward: 170,
    isActive: true,
    isFeatured: true,
    isPopular: true,
    totalAttempts: 395,
    questions: [
      {
        id: "sql1",
        questionText: "Which SQL JOIN returns all records from the left table, and matching records from the right table, filling nulls if no match?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
        correctAnswer: 1,
        explanation: "A LEFT OUTER JOIN preserves every row from the left table regardless of whether the right table satisfies the join condition.",
        difficulty: "Easy",
        topic: "SQL Joins"
      },
      {
        id: "sql2",
        questionText: "In SQL, what clause is strictly required to filter rows based on aggregate function results (e.g. COUNT(*) > 5)?",
        options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
        correctAnswer: 1,
        explanation: "The WHERE clause filters before aggregation, while the HAVING clause filters groups after aggregate calculations.",
        difficulty: "Medium",
        topic: "Aggregations"
      },
      {
        id: "sql3",
        questionText: "What does the 'I' in the ACID database transaction properties acronym stand for?",
        options: ["Integrity", "Isolation", "Immutability", "Indexing"],
        correctAnswer: 1,
        explanation: "Isolation ensures concurrent transactions execute without interference, preserving consistency as if executed serially.",
        difficulty: "Medium",
        topic: "Transactions & ACID"
      }
    ]
  },
  {
    id: "quiz-cs-core-os",
    title: "Computer Science: OS & Networks",
    description: "Master process scheduling, deadlocks, virtual memory, TCP/IP stack layers, and networking protocols.",
    category: "Computer Science",
    difficulty: "Hard",
    timeLimitMinutes: 15,
    xpReward: 500,
    pointsReward: 200,
    isActive: true,
    isPopular: true,
    totalAttempts: 290,
    questions: [
      {
        id: "cs1",
        questionText: "Which condition is NOT one of Coffman's four necessary conditions for a deadlock to occur in an operating system?",
        options: ["Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait"],
        correctAnswer: 2,
        explanation: "No preemption is the required condition for deadlocks. Allowing preemption breaks deadlocks.",
        difficulty: "Hard",
        topic: "Operating Systems"
      },
      {
        id: "cs2",
        questionText: "At which layer of the OSI model does the TCP (Transmission Control Protocol) operate?",
        options: ["Network Layer (Layer 3)", "Transport Layer (Layer 4)", "Session Layer (Layer 5)", "Data Link Layer (Layer 2)"],
        correctAnswer: 1,
        explanation: "TCP operates at Layer 4 (Transport Layer), providing reliable, ordered end-to-end byte stream delivery.",
        difficulty: "Medium",
        topic: "Computer Networks"
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

export const createPublicQuiz = async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      category, 
      difficulty = 'Medium', 
      timeLimitMinutes = 15, 
      questions = [],
      targetGrade
    } = req.body;

    const quizId = `quiz-${Date.now()}`;
    const authorId = req.user?.id || 'usr-teacher-custom';
    const authorName = req.user?.name || req.body.createdBy || 'Educator';

    const calculatedXp = questions.length * 75;
    const calculatedPoints = questions.length * 30;

    const newQuiz = {
      id: quizId,
      title: title.trim(),
      description: description?.trim() || `Educational quiz on ${title.trim()}.`,
      category: category.trim(),
      difficulty,
      timeLimitMinutes: parseInt(timeLimitMinutes, 10) || 15,
      targetGrade: targetGrade || 'General Audience',
      xpReward: calculatedXp,
      pointsReward: calculatedPoints,
      isActive: true,
      totalAttempts: 0,
      createdBy: authorName,
      createdAt: new Date().toISOString(),
      questions: questions.map((q, idx) => ({
        id: q.id || `q-${Date.now()}-${idx}`,
        questionText: q.questionText.trim(),
        options: q.options.map(opt => String(opt).trim()),
        correctAnswer: Number(q.correctAnswer) || 0,
        explanation: q.explanation ? q.explanation.trim() : `The correct option is choice ${['A', 'B', 'C', 'D'][Number(q.correctAnswer) || 0]}.`,
        difficulty: q.difficulty || difficulty,
        topic: q.topic ? q.topic.trim() : category.trim(),
        order_index: idx
      }))
    };

    // 1. Try persisting to PostgreSQL
    const client = await pool.connect().catch(() => null);
    if (client) {
      try {
        await client.query('BEGIN');
        await client.query(
          `INSERT INTO quizzes (id, title, description, category, difficulty, time_limit_minutes, xp_reward, points_reward, is_active, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, $9)`,
          [
            quizId,
            newQuiz.title,
            newQuiz.description,
            newQuiz.category,
            newQuiz.difficulty,
            newQuiz.timeLimitMinutes,
            newQuiz.xpReward,
            newQuiz.pointsReward,
            authorId
          ]
        );

        for (let i = 0; i < newQuiz.questions.length; i++) {
          const q = newQuiz.questions[i];
          await client.query(
            `INSERT INTO questions (id, quiz_id, question_text, correct_answer_index, explanation, difficulty, topic, order_index)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [q.id, quizId, q.questionText, q.correctAnswer, q.explanation, q.difficulty, q.topic, i]
          );

          for (let o = 0; o < q.options.length; o++) {
            await client.query(
              `INSERT INTO question_options (id, question_id, option_index, option_text)
               VALUES ($1, $2, $3, $4)`,
              [`opt-${q.id}-${o}`, q.id, o, q.options[o]]
            );
          }
        }
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('[DB NOTICE] Could not save quiz to postgres, saved to memory store:', err.message);
      } finally {
        client.release();
      }
    }

    // 2. Add to in-memory store
    quizzesDb.unshift(newQuiz);

    return res.status(201).json({
      success: true,
      message: 'Quiz created and published successfully',
      data: { quiz: newQuiz }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Quiziverse Mock Data Store (Phase 1)
 * Rich seed data for Quizzes, Questions, Leaderboard, Achievements, and Profiles.
 */

export const initialQuizzes = [
  {
    id: "quiz-web-dev-101",
    quizCode: "WEB101",
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
        id: "q1",
        questionText: "Which HTML5 semantic element is best suited to encapsulate an independent, self-contained piece of content?",
        options: ["<div>", "<article>", "<section>", "<aside>"],
        correctAnswer: 1,
        explanation: "The <article> tag specifies independent, self-contained content that can be distributed independently, such as a forum post or news article.",
        difficulty: "Easy",
        topic: "HTML5"
      },
      {
        id: "q2",
        questionText: "In CSS Flexbox, which property aligns flex items along the cross axis inside the flex container?",
        options: ["justify-content", "align-items", "flex-direction", "align-content"],
        correctAnswer: 1,
        explanation: "While 'justify-content' aligns items along the main axis, 'align-items' controls alignment along the cross axis.",
        difficulty: "Easy",
        topic: "CSS3"
      },
      {
        id: "q3",
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
        id: "q4",
        questionText: "Which HTTP status code signifies that the requested resource was not found on the server?",
        options: ["401 Unauthorized", "403 Forbidden", "404 Not Found", "500 Internal Server Error"],
        correctAnswer: 2,
        explanation: "HTTP 404 indicates that the server cannot locate the requested resource.",
        difficulty: "Easy",
        topic: "HTTP Protocols"
      },
      {
        id: "q5",
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
    quizCode: "PROG201",
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
    quizCode: "DS301",
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
    quizCode: "QUANT401",
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
    quizCode: "GK101",
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
    quizCode: "SCI201",
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
    quizCode: "AI501",
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
    quizCode: "SQL101",
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
    quizCode: "CS501",
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

export const initialAchievements = [
  {
    id: "ach-1",
    code: "FIRST_QUIZ",
    title: "First Steps",
    description: "Complete your very first quiz on Quiziverse.",
    badgeTier: "Bronze",
    icon: "Rocket",
    xpAward: 100,
    isUnlocked: true,
    unlockedAt: "2026-03-01",
    progress: 1,
    maxProgress: 1
  },
  {
    id: "ach-2",
    code: "QUIZ_FIVE",
    title: "Curious Mind",
    description: "Complete 5 different quizzes successfully.",
    badgeTier: "Silver",
    icon: "BookOpen",
    xpAward: 250,
    isUnlocked: true,
    unlockedAt: "2026-03-08",
    progress: 5,
    maxProgress: 5
  },
  {
    id: "ach-3",
    code: "QUIZ_TEN",
    title: "Trivia Titan",
    description: "Complete 10 quizzes across any category.",
    badgeTier: "Gold",
    icon: "Award",
    xpAward: 500,
    isUnlocked: true,
    unlockedAt: "2026-03-14",
    progress: 12,
    maxProgress: 10
  },
  {
    id: "ach-4",
    code: "HIGH_SCORE_90",
    title: "Sharpshooter",
    description: "Score 90% or higher on any medium or hard quiz.",
    badgeTier: "Gold",
    icon: "Target",
    xpAward: 400,
    isUnlocked: true,
    unlockedAt: "2026-03-12",
    progress: 1,
    maxProgress: 1
  },
  {
    id: "ach-5",
    code: "PERFECT_SCORE",
    title: "Perfectionist",
    description: "Score 100% on any quiz without missing a single question.",
    badgeTier: "Gold",
    icon: "Crown",
    xpAward: 600,
    isUnlocked: false,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1
  },
  {
    id: "ach-6",
    code: "STREAK_7",
    title: "Relentless Explorer",
    description: "Maintain a daily quiz streak for 7 consecutive days.",
    badgeTier: "Platinum",
    icon: "Flame",
    xpAward: 800,
    isUnlocked: false,
    unlockedAt: null,
    progress: 4,
    maxProgress: 7
  }
];

export const initialLeaderboard = {
  global: [
    { rank: 1, username: "ElenaRov", points: 5420, xp: 9800, quizzesCompleted: 42, streak: 15, avatarBg: "#f59e0b" },
    { rank: 2, username: "ZackCodes", points: 4890, xp: 8750, quizzesCompleted: 38, streak: 11, avatarBg: "#94a3b8" },
    { rank: 3, username: "DevPriya", points: 4320, xp: 7900, quizzesCompleted: 34, streak: 9, avatarBg: "#d97706" },
    { rank: 4, username: "Kiran_AI", points: 3800, xp: 6800, quizzesCompleted: 29, streak: 6, avatarBg: "#6366f1" },
    { rank: 5, username: "LucasM", points: 3200, xp: 5900, quizzesCompleted: 24, streak: 5, avatarBg: "#8b5cf6" },
    { rank: 6, username: "Alex Johnson (You)", points: 2650, xp: 4850, quizzesCompleted: 12, streak: 4, avatarBg: "#06b6d4" },
    { rank: 7, username: "Sarah_T", points: 2400, xp: 4300, quizzesCompleted: 18, streak: 3, avatarBg: "#10b981" },
    { rank: 8, username: "NeoMatrix", points: 2150, xp: 3950, quizzesCompleted: 15, streak: 2, avatarBg: "#ec4899" },
    { rank: 9, username: "ChloeW", points: 1900, xp: 3500, quizzesCompleted: 13, streak: 2, avatarBg: "#f43f5e" },
    { rank: 10, username: "AidenSmith", points: 1750, xp: 3100, quizzesCompleted: 11, streak: 1, avatarBg: "#3b82f6" }
  ],
  weekly: [
    { rank: 1, username: "ZackCodes", points: 1250, xp: 2400, quizzesCompleted: 9, streak: 7, avatarBg: "#f59e0b" },
    { rank: 2, username: "Alex Johnson (You)", points: 1100, xp: 2150, quizzesCompleted: 6, streak: 4, avatarBg: "#06b6d4" },
    { rank: 3, username: "ElenaRov", points: 950, xp: 1900, quizzesCompleted: 7, streak: 7, avatarBg: "#94a3b8" },
    { rank: 4, username: "DevPriya", points: 820, xp: 1600, quizzesCompleted: 5, streak: 5, avatarBg: "#6366f1" },
    { rank: 5, username: "LucasM", points: 700, xp: 1350, quizzesCompleted: 4, streak: 3, avatarBg: "#8b5cf6" }
  ],
  monthly: [
    { rank: 1, username: "ElenaRov", points: 3400, xp: 6200, quizzesCompleted: 24, streak: 15, avatarBg: "#f59e0b" },
    { rank: 2, username: "ZackCodes", points: 3100, xp: 5800, quizzesCompleted: 22, streak: 11, avatarBg: "#94a3b8" },
    { rank: 3, username: "Kiran_AI", points: 2800, xp: 5100, quizzesCompleted: 19, streak: 6, avatarBg: "#d97706" },
    { rank: 4, username: "Alex Johnson (You)", points: 2450, xp: 4500, quizzesCompleted: 12, streak: 4, avatarBg: "#06b6d4" }
  ]
};

export const initialRecentAttempts = [
  {
    attemptId: "att-001",
    quizId: "quiz-web-dev-101",
    quizTitle: "Web Development Fundamentals",
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    timeTakenSeconds: 245,
    completedAt: "2026-03-15T10:30:00Z",
    status: "Passed",
    xpEarned: 200,
    pointsEarned: 80
  },
  {
    attemptId: "att-002",
    quizId: "quiz-python-ds",
    quizTitle: "Python Data Structures & Algorithms",
    score: 4,
    totalQuestions: 4,
    percentage: 100,
    timeTakenSeconds: 320,
    completedAt: "2026-03-14T15:20:00Z",
    status: "Passed",
    xpEarned: 400,
    pointsEarned: 180
  },
  {
    attemptId: "att-003",
    quizId: "quiz-cloud-devops",
    quizTitle: "Cloud Computing & Docker Architecture",
    score: 1,
    totalQuestions: 2,
    percentage: 50,
    timeTakenSeconds: 150,
    completedAt: "2026-03-12T18:45:00Z",
    status: "Review Needed",
    xpEarned: 175,
    pointsEarned: 80
  }
];

export const demoUsers = {
  student: {
    id: "usr-std-101",
    name: "Alex Johnson",
    email: "student@quiziverse.io",
    role: "student",
    grade: "Undergraduate",
    points: 2650,
    xp: 4850,
    level: 5,
    streak: 4,
    rank: 6,
    quizzesAttempted: 12,
    averagePercentage: 86.5
  },
  teacher: {
    id: "usr-tch-201",
    name: "Prof. Sarah Lin",
    email: "teacher@quiziverse.io",
    role: "teacher",
    grade: "Faculty Instructor",
    department: "Computer Science & Engineering",
    points: 5200,
    xp: 9400,
    level: 9,
    streak: 12,
    rank: 3,
    quizzesCreated: 8,
    totalStudentsTaught: 342,
    quizzesAttempted: 24,
    averagePercentage: 94.0
  },
  admin: {
    id: "usr-adm-001",
    name: "Sarah Mitchell",
    email: "admin@quiziverse.io",
    role: "admin",
    grade: "Faculty Lead",
    points: 8400,
    xp: 15200,
    level: 14,
    streak: 22,
    rank: 1,
    quizzesAttempted: 48,
    averagePercentage: 96.0
  }
};

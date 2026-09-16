/**
 * Quiziverse Mock Data Store (Phase 1)
 * Rich seed data for Quizzes, Questions, Leaderboard, Achievements, and Profiles.
 */

export const initialQuizzes = [
  {
    id: "quiz-web-dev-101",
    title: "Web Development Fundamentals",
    description: "Test your mastery over modern HTML5 semantic markup, CSS3 layouts (Flexbox & Grid), and modern JavaScript ES6+ features.",
    category: "Computer Science",
    difficulty: "Easy",
    timeLimitMinutes: 10,
    xpReward: 250,
    pointsReward: 100,
    isActive: true,
    totalAttempts: 342,
    questions: [
      {
        id: "q1",
        questionText: "Which HTML5 semantic element is best suited to encapsulate an independent, self-contained piece of content?",
        options: [
          "<div>",
          "<article>",
          "<section>",
          "<aside>"
        ],
        correctAnswer: 1, // <article>
        explanation: "The <article> tag specifies independent, self-contained content that can be distributed independently, such as a forum post, news article, or blog entry.",
        difficulty: "Easy",
        topic: "HTML5"
      },
      {
        id: "q2",
        questionText: "In CSS Flexbox, which property aligns flex items along the cross axis inside the flex container?",
        options: [
          "justify-content",
          "align-items",
          "flex-direction",
          "align-content"
        ],
        correctAnswer: 1, // align-items
        explanation: "While 'justify-content' aligns items along the main axis, 'align-items' controls alignment along the perpendicular cross axis.",
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
        options: [
          "401 Unauthorized",
          "403 Forbidden",
          "404 Not Found",
          "500 Internal Server Error"
        ],
        correctAnswer: 2,
        explanation: "HTTP 404 indicates that the server cannot locate the requested resource, typically when a URL is mistyped or removed.",
        difficulty: "Easy",
        topic: "HTTP Protocols"
      },
      {
        id: "q5",
        questionText: "Which JavaScript method returns a new array populated with the results of calling a provided function on every element?",
        options: [
          "Array.prototype.filter()",
          "Array.prototype.forEach()",
          "Array.prototype.map()",
          "Array.prototype.reduce()"
        ],
        correctAnswer: 2,
        explanation: "map() executes a callback for each element and builds a new array of matching length containing the callback return values.",
        difficulty: "Easy",
        topic: "JavaScript Arrays"
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
        id: "py1",
        questionText: "What is the average time complexity for searching a key in a standard Python dictionary (hash map)?",
        options: [
          "O(n)",
          "O(log n)",
          "O(1)",
          "O(n log n)"
        ],
        correctAnswer: 2,
        explanation: "Python dictionaries use hash tables internally, providing O(1) average time complexity for lookups, insertions, and deletions.",
        difficulty: "Medium",
        topic: "Data Structures"
      },
      {
        id: "py2",
        questionText: "Which of the following Python data types is immutable?",
        options: [
          "list",
          "dict",
          "set",
          "tuple"
        ],
        correctAnswer: 3,
        explanation: "Tuples are immutable sequences in Python; once created, their elements cannot be changed, added, or removed.",
        difficulty: "Medium",
        topic: "Python Core"
      },
      {
        id: "py3",
        questionText: "What will `[x**2 for x in range(5) if x % 2 == 0]` evaluate to?",
        options: [
          "[0, 4, 16]",
          "[1, 9]",
          "[0, 1, 4, 9, 16]",
          "[4, 16]"
        ],
        correctAnswer: 0,
        explanation: "range(5) gives 0, 1, 2, 3, 4. Even numbers are 0, 2, 4. Their squares are 0, 4, and 16.",
        difficulty: "Medium",
        topic: "List Comprehensions"
      },
      {
        id: "py4",
        questionText: "In Big-O notation, which asymptotic bound best describes the worst-case time complexity of Merge Sort?",
        options: [
          "O(n^2)",
          "O(n log n)",
          "O(n)",
          "O(log n)"
        ],
        correctAnswer: 1,
        explanation: "Merge Sort consistently divides the array into halves (log n levels) and merges them in O(n) time at each level, ensuring O(n log n) even in the worst case.",
        difficulty: "Medium",
        topic: "Sorting Algorithms"
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
        options: [
          "ReLU",
          "Leaky ReLU",
          "Sigmoid",
          "GELU"
        ],
        correctAnswer: 2,
        explanation: "The derivative of the Sigmoid function caps at 0.25. Multiplying many values < 1 during backpropagation causes gradients to vanish exponentially.",
        difficulty: "Hard",
        topic: "Deep Learning"
      },
      {
        id: "ai3",
        questionText: "In supervised learning, what term describes a model that performs well on training data but poorly on unseen test data?",
        options: [
          "Underfitting",
          "Overfitting",
          "High Bias",
          "Regularization"
        ],
        correctAnswer: 1,
        explanation: "Overfitting occurs when a model memorizes noise and specific patterns in the training set rather than learning generalizable features.",
        difficulty: "Hard",
        topic: "Model Evaluation"
      }
    ]
  },
  {
    id: "quiz-cloud-devops",
    title: "Cloud Computing & Docker Architecture",
    description: "Containerization, microservices, Linux fundamentals, and scalable cloud deployment models.",
    category: "DevOps",
    difficulty: "Medium",
    timeLimitMinutes: 10,
    xpReward: 350,
    pointsReward: 160,
    isActive: true,
    totalAttempts: 95,
    questions: [
      {
        id: "d1",
        questionText: "What is the fundamental difference between a Docker container and a traditional Virtual Machine?",
        options: [
          "Containers require their own dedicated hypervisor",
          "Containers share the host OS kernel, making them lightweight",
          "Containers cannot run Linux applications on macOS",
          "VMs do not use operating system images"
        ],
        correctAnswer: 1,
        explanation: "Containers virtualize at the OS level and share the host kernel, while VMs virtualize hardware and run an entire guest operating system.",
        difficulty: "Medium",
        topic: "Containers"
      },
      {
        id: "d2",
        questionText: "Which Dockerfile instruction specifies the default command executed when running the container?",
        options: [
          "RUN",
          "COPY",
          "CMD",
          "EXPOSE"
        ],
        correctAnswer: 2,
        explanation: "CMD provides default arguments for an executing container, whereas RUN executes commands to build layers during image creation.",
        difficulty: "Medium",
        topic: "Docker"
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

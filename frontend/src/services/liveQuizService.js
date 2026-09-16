/**
 * Live Quiz Arena Service Layer
 * Isolates multi-user competitive room management, synchronized timers,
 * 100+ participant roster generation, live scoring, and podium calculations.
 */

// Realistic participant name seeds
const nameSeeds = [
  "NovaCoder", "ByteMaster", "CyberKnight", "Alex_dev", "Priya_CS", 
  "QuantumLeap", "Viper99", "Zenith", "PixelPioneer", "EchoStar", 
  "CodeSamurai", "AlphaHelix", "MatrixRunner", "DataWizard", "SyntaxSorcerer",
  "DevSarah", "TechTitan", "LogicGuru", "BinaryBeast", "CloudStrider",
  "AlgoRhythm", "ShadowCoder", "NeonRider", "SwiftNinja", "Hyperion",
  "Solaris", "ApexPredator", "KernelPanic", "InfiniteLoop", "NullPointer",
  "StackOverflowed", "BitFlipper", "GitMaster", "Rustacean", "AsyncAwait",
  "TurboPascal", "ReactNinja", "PyPro", "CyberSamurai", "BugHunter"
];

const avatarColors = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", 
  "#06b6d4", "#3b82f6", "#f43f5e", "#d946ef", "#14b8a6"
];

export const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'QVS';
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createLiveParticipantsRoster = (currentUser, count = 104) => {
  const roster = [];
  
  // 1. Current user
  roster.push({
    id: 'user-self',
    name: currentUser?.name || 'Alex Johnson (You)',
    isUser: true,
    score: 0,
    avatarBg: '#6366f1',
    rank: 1,
    streak: 0,
    lastAnswerCorrect: null,
    answeredInTime: null
  });

  // 2. Simulated 100+ concurrent players
  for (let i = 1; i < count; i++) {
    const baseName = nameSeeds[i % nameSeeds.length];
    const suffix = i > nameSeeds.length ? `_${i}` : '';
    roster.push({
      id: `bot-p-${i}`,
      name: `${baseName}${suffix}`,
      isUser: false,
      score: 0,
      avatarBg: avatarColors[i % avatarColors.length],
      rank: i + 1,
      streak: 0,
      skillTier: 0.65 + Math.random() * 0.3, // Accuracy probability 65% - 95%
      lastAnswerCorrect: null,
      answeredInTime: null
    });
  }

  return roster;
};

export const defaultArenaQuestions = [
  {
    id: "arena-q1",
    topic: "Algorithms & Complexity",
    questionText: "What is the average time complexity of finding an element in a balanced Binary Search Tree (AVL / Red-Black)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    timeLimitSeconds: 15,
    explanation: "Because the tree is strictly balanced, the height is bounded by O(log n), providing logarithmic search time."
  },
  {
    id: "arena-q2",
    topic: "Web Performance",
    questionText: "Which HTTP header is specifically used to prevent cross-site clickjacking attacks inside iframes?",
    options: ["Access-Control-Allow-Origin", "X-Frame-Options", "Content-Encoding", "Strict-Transport-Security"],
    correctAnswer: 1,
    timeLimitSeconds: 15,
    explanation: "X-Frame-Options: DENY or SAMEORIGIN tells browsers not to render the page in a frame or iframe."
  },
  {
    id: "arena-q3",
    topic: "Database Architecture",
    questionText: "In relational databases, which B-Tree property ensures all leaf nodes remain at the exact same depth?",
    options: ["Complete Balance", "Linear Hashing", "Log-Structured Merge", "Denormalization"],
    correctAnswer: 0,
    timeLimitSeconds: 15,
    explanation: "B-Trees auto-balance upon insertions and deletions by node splitting and merging, guaranteeing uniform depth."
  },
  {
    id: "arena-q4",
    topic: "Artificial Intelligence",
    questionText: "What critical problem does the Multi-Head Self-Attention mechanism solve over recurrent networks (RNNs)?",
    options: [
      "Limits memory usage to constant space",
      "Enables full sequence parallelization and captures arbitrary-distance dependencies",
      "Replaces all neural weights with decision trees",
      "Eliminates the need for training loss functions"
    ],
    correctAnswer: 1,
    timeLimitSeconds: 15,
    explanation: "Self-attention removes sequential step-by-step unrolling, allowing GPU matrix parallelism across all sequence positions."
  },
  {
    id: "arena-q5",
    topic: "Computer Systems",
    questionText: "What is the primary function of the Translation Lookaside Buffer (TLB) inside a CPU memory management unit?",
    options: [
      "Cache recent virtual-to-physical page address translations",
      "Schedule preemptive thread priority context switches",
      "Compress swap file memory on solid-state drives",
      "Store encrypted private keys"
    ],
    correctAnswer: 0,
    timeLimitSeconds: 15,
    explanation: "The TLB is a specialized hardware cache in the MMU that drastically speeds up virtual-to-physical address translation."
  }
];

export const calculateQuestionScore = (isCorrect, secondsLeft, totalSeconds = 15) => {
  if (!isCorrect) return 0;
  // Maximum 1000 points per question, faster answer earns more
  const speedBonus = Math.round((secondsLeft / totalSeconds) * 400);
  return 600 + speedBonus;
};

export const simulateBotRoundAnswers = (participants, correctAnswer, totalSeconds = 15) => {
  return participants.map(p => {
    if (p.isUser) return p;

    // Determine correctness based on skill tier
    const isCorrect = Math.random() < (p.skillTier || 0.75);
    const responseTime = 2 + Math.random() * (totalSeconds - 3); // answers within 2s to 14s
    const secondsRemaining = Math.max(1, Math.round(totalSeconds - responseTime));
    const pointsGained = calculateQuestionScore(isCorrect, secondsRemaining, totalSeconds);

    return {
      ...p,
      score: p.score + pointsGained,
      streak: isCorrect ? p.streak + 1 : 0,
      lastAnswerCorrect: isCorrect,
      answeredInTime: Math.round(responseTime * 10) / 10
    };
  });
};

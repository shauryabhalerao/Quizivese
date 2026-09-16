/**
 * ============================================================================
 * QUIZIVERSE GAMIFICATION SERVICE
 * Handles Daily Streaks, Level Progression & Titles, and Milestone Badges.
 * ============================================================================
 */

export const MASTER_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    code: 'FIRST_QUIZ',
    title: 'First Steps',
    description: 'Complete your very first quiz on Quiziverse.',
    badgeTier: 'Bronze',
    icon: 'Rocket',
    xpAward: 100,
    maxProgress: 1
  },
  {
    id: 'ach-2',
    code: 'QUIZ_FIVE',
    title: 'Curious Mind',
    description: 'Complete 5 different quizzes successfully.',
    badgeTier: 'Silver',
    icon: 'BookOpen',
    xpAward: 250,
    maxProgress: 5
  },
  {
    id: 'ach-3',
    code: 'QUIZ_TEN',
    title: 'Trivia Titan',
    description: 'Complete 10 quizzes across any category.',
    badgeTier: 'Gold',
    icon: 'Award',
    xpAward: 500,
    maxProgress: 10
  },
  {
    id: 'ach-4',
    code: 'HIGH_SCORE_90',
    title: 'Sharpshooter',
    description: 'Score 90% or higher on any quiz.',
    badgeTier: 'Gold',
    icon: 'Target',
    xpAward: 400,
    maxProgress: 1
  },
  {
    id: 'ach-5',
    code: 'PERFECT_SCORE',
    title: 'Perfectionist',
    description: 'Score 100% on any quiz without missing a single question.',
    badgeTier: 'Gold',
    icon: 'Crown',
    xpAward: 600,
    maxProgress: 1
  },
  {
    id: 'ach-6',
    code: 'STREAK_3',
    title: 'Habit Former',
    description: 'Maintain a daily quiz streak for 3 consecutive days.',
    badgeTier: 'Bronze',
    icon: 'Flame',
    xpAward: 200,
    maxProgress: 3
  },
  {
    id: 'ach-7',
    code: 'STREAK_7',
    title: 'Relentless Explorer',
    description: 'Maintain a daily quiz streak for 7 consecutive days.',
    badgeTier: 'Platinum',
    icon: 'Flame',
    xpAward: 800,
    maxProgress: 7
  },
  {
    id: 'ach-8',
    code: 'SPEED_DEMON',
    title: 'Speed Demon',
    description: 'Complete a quiz in under 60 seconds with 80% or higher score.',
    badgeTier: 'Silver',
    icon: 'Zap',
    xpAward: 350,
    maxProgress: 1
  },
  {
    id: 'ach-9',
    code: 'AI_PIONEER',
    title: 'AI Pioneer',
    description: 'Generate and successfully complete an AI-crafted quiz.',
    badgeTier: 'Silver',
    icon: 'Sparkles',
    xpAward: 300,
    maxProgress: 1
  },
  {
    id: 'ach-10',
    code: 'LEVEL_5',
    title: 'High Achiever',
    description: 'Reach Student Level 5 by accumulating 4,000+ XP.',
    badgeTier: 'Platinum',
    icon: 'Trophy',
    xpAward: 1000,
    maxProgress: 5
  }
];

export const getRankTitle = (level) => {
  if (level <= 2) return 'Apprentice Initiate';
  if (level <= 4) return 'Knowledge Seeker';
  if (level <= 6) return 'Master Scholar';
  if (level <= 9) return 'Quiz Luminary';
  return 'Quiziverse Grandmaster';
};

/**
 * Calculates Level details from total XP.
 * Each level requires 1,000 XP.
 * Level 1: 0 - 999 XP
 * Level 2: 1000 - 1999 XP, etc.
 */
export const calculateLevel = (currentTotalXp, previousTotalXp = 0) => {
  const level = Math.floor(currentTotalXp / 1000) + 1;
  const oldLevel = Math.floor(previousTotalXp / 1000) + 1;
  const currentLevelBaseXp = (level - 1) * 1000;
  const xpIntoCurrentLevel = currentTotalXp - currentLevelBaseXp;
  const xpNeededForNextLevel = 1000;
  const xpToNextLevel = Math.max(0, 1000 - xpIntoCurrentLevel);
  const progressPercentage = Math.min(100, Math.round((xpIntoCurrentLevel / xpNeededForNextLevel) * 100));

  return {
    level,
    oldLevel,
    leveledUp: level > oldLevel,
    title: getRankTitle(level),
    currentLevelBaseXp,
    xpIntoCurrentLevel,
    xpToNextLevel,
    progressPercentage
  };
};

/**
 * Evaluates daily quiz streak.
 * Compares current date with user's last_active_at timestamp.
 */
export const evaluateStreak = (currentStreak = 1, longestStreak = 1, lastActiveAt = null, now = new Date()) => {
  if (!lastActiveAt) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, longestStreak),
      isExtended: false,
      isReset: false,
      isFirstActivity: true
    };
  }

  const nowDate = new Date(now);
  const lastDate = new Date(lastActiveAt);

  // Normalize to UTC midnight dates for strict calendar day comparison
  const nowUtc = Date.UTC(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
  const lastUtc = Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.floor((nowUtc - lastUtc) / msPerDay);

  if (diffDays === 0) {
    // Same day activity: streak remains active, no increment needed
    return {
      currentStreak: Math.max(1, currentStreak),
      longestStreak: Math.max(currentStreak, longestStreak),
      isExtended: false,
      isReset: false,
      isSameDay: true
    };
  } else if (diffDays === 1) {
    // Consecutive day activity: streak extended!
    const updatedCurrent = (currentStreak || 0) + 1;
    const updatedLongest = Math.max(updatedCurrent, longestStreak || 1);
    return {
      currentStreak: updatedCurrent,
      longestStreak: updatedLongest,
      isExtended: true,
      isReset: false,
      isSameDay: false
    };
  } else {
    // Missed 1 or more calendar days: streak resets to 1
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, longestStreak),
      isExtended: false,
      isReset: true,
      isSameDay: false
    };
  }
};

/**
 * Evaluates all milestone achievement triggers against an attempt and user history.
 */
export const evaluateAchievements = ({
  unlockedCodes = new Set(),
  attemptCount = 1,
  currentStreak = 1,
  currentLevel = 1,
  attemptPercentage = 0,
  timeTakenSeconds = 0,
  isAiQuiz = false
}) => {
  const newlyUnlocked = [];
  const progressMap = {};

  for (const ach of MASTER_ACHIEVEMENTS) {
    const isAlreadyUnlocked = unlockedCodes.has(ach.code);
    let currentProgress = 0;
    let shouldUnlock = false;

    switch (ach.code) {
      case 'FIRST_QUIZ':
        currentProgress = Math.min(ach.maxProgress, attemptCount);
        shouldUnlock = attemptCount >= 1;
        break;

      case 'QUIZ_FIVE':
        currentProgress = Math.min(ach.maxProgress, attemptCount);
        shouldUnlock = attemptCount >= 5;
        break;

      case 'QUIZ_TEN':
        currentProgress = Math.min(ach.maxProgress, attemptCount);
        shouldUnlock = attemptCount >= 10;
        break;

      case 'PERFECT_SCORE':
        currentProgress = attemptPercentage === 100 ? 1 : (isAlreadyUnlocked ? 1 : 0);
        shouldUnlock = attemptPercentage === 100;
        break;

      case 'HIGH_SCORE_90':
        currentProgress = attemptPercentage >= 90 ? 1 : (isAlreadyUnlocked ? 1 : 0);
        shouldUnlock = attemptPercentage >= 90;
        break;

      case 'STREAK_3':
        currentProgress = Math.min(ach.maxProgress, currentStreak);
        shouldUnlock = currentStreak >= 3;
        break;

      case 'STREAK_7':
        currentProgress = Math.min(ach.maxProgress, currentStreak);
        shouldUnlock = currentStreak >= 7;
        break;

      case 'SPEED_DEMON':
        currentProgress = (timeTakenSeconds < 60 && attemptPercentage >= 80) ? 1 : (isAlreadyUnlocked ? 1 : 0);
        shouldUnlock = timeTakenSeconds < 60 && attemptPercentage >= 80;
        break;

      case 'AI_PIONEER':
        currentProgress = isAiQuiz ? 1 : (isAlreadyUnlocked ? 1 : 0);
        shouldUnlock = Boolean(isAiQuiz);
        break;

      case 'LEVEL_5':
        currentProgress = Math.min(ach.maxProgress, currentLevel);
        shouldUnlock = currentLevel >= 5;
        break;

      default:
        currentProgress = 0;
        shouldUnlock = false;
    }

    progressMap[ach.code] = {
      progress: isAlreadyUnlocked ? ach.maxProgress : currentProgress,
      maxProgress: ach.maxProgress,
      isUnlocked: isAlreadyUnlocked || shouldUnlock
    };

    if (!isAlreadyUnlocked && shouldUnlock) {
      newlyUnlocked.push({
        ...ach,
        isUnlocked: true,
        unlockedAt: new Date().toISOString()
      });
    }
  }

  const bonusXp = newlyUnlocked.reduce((sum, item) => sum + item.xpAward, 0);

  return {
    newlyUnlocked,
    progressMap,
    bonusXp
  };
};

export const gamificationService = {
  MASTER_ACHIEVEMENTS,
  getRankTitle,
  calculateLevel,
  evaluateStreak,
  evaluateAchievements
};

export default gamificationService;

-- ============================================================================
-- QUIZIVERSE RELATIONAL DATABASE SCHEMA
-- Designed for High Concurrency (100+ Simultaneous Students), ACID Compliance,
-- Strict Referential Integrity, and Optimized Indexing.
-- ============================================================================

-- 1. USERS TABLE
-- Stores student & faculty/admin credentials, gamification stats, and streaks
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    grade VARCHAR(80) DEFAULT 'Undergraduate',
    points INT NOT NULL DEFAULT 100 CHECK (points >= 0),
    xp INT NOT NULL DEFAULT 200 CHECK (xp >= 0),
    level INT NOT NULL DEFAULT 1 CHECK (level >= 1),
    current_streak INT NOT NULL DEFAULT 1 CHECK (current_streak >= 0),
    longest_streak INT NOT NULL DEFAULT 1 CHECK (longest_streak >= 0),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reset_password_token VARCHAR(255),
    reset_password_code VARCHAR(10),
    reset_password_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Schema Migration Alter Guards for users
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_code VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP WITH TIME ZONE;

-- 2. QUIZZES TABLE
-- Stores assessment metadata, time limits, difficulty grading, and rewards
CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    time_limit_minutes INT NOT NULL DEFAULT 10 CHECK (time_limit_minutes BETWEEN 1 AND 180),
    xp_reward INT NOT NULL DEFAULT 300 CHECK (xp_reward >= 0),
    points_reward INT NOT NULL DEFAULT 100 CHECK (points_reward >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    total_attempts INT NOT NULL DEFAULT 0 CHECK (total_attempts >= 0),
    source VARCHAR(50) NOT NULL DEFAULT 'AI',
    created_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Schema Migration Alter Guard for existing DBs
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'AI';

-- 3. QUESTIONS TABLE
-- Stores question prompts, topic classification, authoritative correct answers, and explanations
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(64) PRIMARY KEY,
    quiz_id VARCHAR(64) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    correct_answer_index INT NOT NULL CHECK (correct_answer_index BETWEEN 0 AND 3),
    explanation TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    topic VARCHAR(100) NOT NULL DEFAULT 'General',
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. QUESTION_OPTIONS TABLE
-- Stores 4 options per question in 3NF normalization
CREATE TABLE IF NOT EXISTS question_options (
    id VARCHAR(64) PRIMARY KEY,
    question_id VARCHAR(64) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_index INT NOT NULL CHECK (option_index BETWEEN 0 AND 3),
    option_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_question_option UNIQUE (question_id, option_index)
);

-- 5. QUIZ_ATTEMPTS TABLE
-- Historical audit trail of every quiz submitted by any student
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id VARCHAR(64) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INT NOT NULL DEFAULT 0 CHECK (score >= 0),
    total_questions INT NOT NULL CHECK (total_questions > 0),
    correct_count INT NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
    incorrect_count INT NOT NULL DEFAULT 0 CHECK (incorrect_count >= 0),
    unanswered_count INT NOT NULL DEFAULT 0 CHECK (unanswered_count >= 0),
    percentage DECIMAL(5, 2) NOT NULL CHECK (percentage BETWEEN 0.00 AND 100.00),
    time_taken_seconds INT NOT NULL DEFAULT 0 CHECK (time_taken_seconds >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'Passed',
    xp_earned INT NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
    points_earned INT NOT NULL DEFAULT 0 CHECK (points_earned >= 0),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Schema Migration Alter Guard for existing DBs
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 6. ATTEMPT_ANSWERS TABLE
-- Records the student's selected answer for every question in each attempt for granular review
CREATE TABLE IF NOT EXISTS attempt_answers (
    id VARCHAR(64) PRIMARY KEY,
    attempt_id VARCHAR(64) NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id VARCHAR(64) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_index INT CHECK (selected_option_index BETWEEN 0 AND 3), -- NULL if unanswered
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_attempt_question UNIQUE (attempt_id, question_id)
);

-- 7. ACHIEVEMENTS TABLE
-- Master definitions for gamification milestone badges
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(60) UNIQUE NOT NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    badge_tier VARCHAR(20) NOT NULL DEFAULT 'Bronze' CHECK (badge_tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    icon VARCHAR(60) NOT NULL DEFAULT 'Award',
    xp_award INT NOT NULL DEFAULT 100 CHECK (xp_award >= 0),
    max_progress INT NOT NULL DEFAULT 1 CHECK (max_progress >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. USER_ACHIEVEMENTS TABLE
-- Pivot table tracking user progress towards achievements (prevents duplicate awards)
CREATE TABLE IF NOT EXISTS user_achievements (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(64) NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0),
    is_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_achievement UNIQUE (user_id, achievement_id)
);

-- ============================================================================
-- PERFORMANCE OPTIMIZATION INDEXES (100+ Concurrent Students)
-- ============================================================================

-- Fast user lookups during authentication
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- High-speed leaderboard rankings (eliminates expensive full-table scans)
CREATE INDEX IF NOT EXISTS idx_users_leaderboard ON users(points DESC, xp DESC);

-- Fast quiz catalog filtering by category, difficulty, and active status
CREATE INDEX IF NOT EXISTS idx_quizzes_catalog ON quizzes(is_active, category, difficulty);

-- Rapid questions loading for quiz-taking engine
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id, order_index);

-- Rapid options loading
CREATE INDEX IF NOT EXISTS idx_options_question_id ON question_options(question_id, option_index);

-- Rapid student attempt history & analytics on dashboard
CREATE INDEX IF NOT EXISTS idx_attempts_user_history ON quiz_attempts(user_id, completed_at DESC);

-- Rapid quiz performance review lookups
CREATE INDEX IF NOT EXISTS idx_attempt_answers_lookup ON attempt_answers(attempt_id);

-- User achievement progress queries
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id, is_unlocked);

-- Rapid rolling leaderboard time-series aggregations (Weekly & Monthly)
CREATE INDEX IF NOT EXISTS idx_attempts_leaderboard ON quiz_attempts(completed_at DESC, points_earned DESC, xp_earned DESC);


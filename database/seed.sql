-- ============================================================================
-- QUIZIVERSE INITIAL DATABASE SEED DATA
-- Populates initial users, quizzes, questions, options, attempts, and achievements.
-- ============================================================================

-- 1. SEED USERS (Students & Admin)
-- password_hash represents bcrypt hash for 'password123'
INSERT INTO users (id, name, email, password_hash, role, grade, points, xp, level, current_streak, longest_streak)
VALUES 
  ('usr-adm-001', 'Sarah Mitchell', 'admin@quiziverse.io', '$2b$10$W7QpL2k59nF3M8KpRn6Ybvz3YrB8rHwHkY1A7WmX0K0M3YzL6M5Xn', 'admin', 'Faculty Lead', 8400, 15200, 14, 22, 25),
  ('usr-std-101', 'Alex Johnson', 'student@quiziverse.io', '$2b$10$E9VfK5i70mE1K9LpQn4Vauy2XqA7qGvGjX0Z6VlW9JzL2XyK5L4Wm', 'student', 'Undergraduate', 2650, 4850, 5, 4, 6),
  ('usr-std-102', 'Elena Rov', 'elena@quiziverse.io', '$2b$10$E9VfK5i70mE1K9LpQn4Vauy2XqA7qGvGjX0Z6VlW9JzL2XyK5L4Wm', 'student', 'Graduate', 5420, 9800, 10, 15, 18),
  ('usr-std-103', 'Zack Codes', 'zack@quiziverse.io', '$2b$10$E9VfK5i70mE1K9LpQn4Vauy2XqA7qGvGjX0Z6VlW9JzL2XyK5L4Wm', 'student', 'Undergraduate', 4890, 8750, 9, 11, 14),
  ('usr-std-104', 'Dev Priya', 'devpriya@quiziverse.io', '$2b$10$E9VfK5i70mE1K9LpQn4Vauy2XqA7qGvGjX0Z6VlW9JzL2XyK5L4Wm', 'student', 'Undergraduate', 4320, 7900, 8, 9, 10),
  ('usr-std-105', 'Kiran AI', 'kiran@quiziverse.io', '$2b$10$E9VfK5i70mE1K9LpQn4Vauy2XqA7qGvGjX0Z6VlW9JzL2XyK5L4Wm', 'student', 'Graduate', 3800, 6800, 7, 6, 8),
  ('usr-std-106', 'Lucas M', 'lucas@quiziverse.io', '$2b$10$E9VfK5i70mE1K9LpQn4Vauy2XqA7qGvGjX0Z6VlW9JzL2XyK5L4Wm', 'student', 'Undergraduate', 3200, 5900, 6, 5, 7),
  ('usr-std-107', 'Sarah T', 'saraht@quiziverse.io', '$2b$10$E9VfK5i70mE1K9LpQn4Vauy2XqA7qGvGjX0Z6VlW9JzL2XyK5L4Wm', 'student', 'Undergraduate', 2400, 4300, 5, 3, 5),
  ('usr-std-108', 'Neo Matrix', 'neo@quiziverse.io', '$2b$10$E9VfK5i70mE1K9LpQn4Vauy2XqA7qGvGjX0Z6VlW9JzL2XyK5L4Wm', 'student', 'High School', 2150, 3950, 4, 2, 4),
  ('usr-std-109', 'Chloe W', 'chloe@quiziverse.io', '$2b$10$E9VfK5i70mE1K9LpQn4Vauy2XqA7qGvGjX0Z6VlW9JzL2XyK5L4Wm', 'student', 'Undergraduate', 1900, 3500, 4, 2, 3),
  ('usr-std-110', 'Aiden Smith', 'aiden@quiziverse.io', '$2b$10$E9VfK5i70mE1K9LpQn4Vauy2XqA7qGvGjX0Z6VlW9JzL2XyK5L4Wm', 'student', 'Undergraduate', 1750, 3100, 3, 1, 3)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED MASTER ACHIEVEMENTS
INSERT INTO achievements (id, code, title, description, badge_tier, icon, xp_award, max_progress)
VALUES
  ('ach-1', 'FIRST_QUIZ', 'First Steps', 'Complete your very first quiz on Quiziverse.', 'Bronze', 'Rocket', 100, 1),
  ('ach-2', 'QUIZ_FIVE', 'Curious Mind', 'Complete 5 different quizzes successfully.', 'Silver', 'BookOpen', 250, 5),
  ('ach-3', 'QUIZ_TEN', 'Trivia Titan', 'Complete 10 quizzes across any category.', 'Gold', 'Award', 500, 10),
  ('ach-4', 'HIGH_SCORE_90', 'Sharpshooter', 'Score 90% or higher on any quiz.', 'Gold', 'Target', 400, 1),
  ('ach-5', 'PERFECT_SCORE', 'Perfectionist', 'Score 100% on any quiz without missing a single question.', 'Gold', 'Crown', 600, 1),
  ('ach-6', 'STREAK_3', 'Habit Former', 'Maintain a daily quiz streak for 3 consecutive days.', 'Bronze', 'Flame', 200, 3),
  ('ach-7', 'STREAK_7', 'Relentless Explorer', 'Maintain a daily quiz streak for 7 consecutive days.', 'Platinum', 'Flame', 800, 7),
  ('ach-8', 'SPEED_DEMON', 'Speed Demon', 'Complete a quiz in under 60 seconds with 80% or higher score.', 'Silver', 'Zap', 350, 1),
  ('ach-9', 'AI_PIONEER', 'AI Pioneer', 'Generate and successfully complete an AI-crafted quiz.', 'Silver', 'Sparkles', 300, 1),
  ('ach-10', 'LEVEL_5', 'High Achiever', 'Reach Student Level 5 by accumulating 4,000+ XP.', 'Platinum', 'Trophy', 1000, 5)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED USER ACHIEVEMENTS FOR DEMO STUDENT
INSERT INTO user_achievements (id, user_id, achievement_id, progress, is_unlocked, unlocked_at)
VALUES
  ('uach-std-1', 'usr-std-101', 'ach-1', 1, TRUE, CURRENT_TIMESTAMP - INTERVAL '14 days'),
  ('uach-std-2', 'usr-std-101', 'ach-2', 5, TRUE, CURRENT_TIMESTAMP - INTERVAL '7 days'),
  ('uach-std-3', 'usr-std-101', 'ach-3', 10, TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('uach-std-4', 'usr-std-101', 'ach-4', 1, TRUE, CURRENT_TIMESTAMP - INTERVAL '1 days'),
  ('uach-std-5', 'usr-std-101', 'ach-5', 0, FALSE, NULL),
  ('uach-std-6', 'usr-std-101', 'ach-6', 3, TRUE, CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ('uach-std-7', 'usr-std-101', 'ach-7', 4, FALSE, NULL),
  ('uach-std-8', 'usr-std-101', 'ach-8', 0, FALSE, NULL),
  ('uach-std-9', 'usr-std-101', 'ach-9', 0, FALSE, NULL),
  ('uach-std-10', 'usr-std-101', 'ach-10', 5, TRUE, CURRENT_TIMESTAMP - INTERVAL '1 days')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED QUIZZES
INSERT INTO quizzes (id, title, description, category, difficulty, time_limit_minutes, xp_reward, points_reward, is_active, total_attempts, created_by)
VALUES
  (
    'quiz-web-dev-101',
    'Web Development Fundamentals',
    'Test your mastery over modern HTML5 semantic markup, CSS3 layouts (Flexbox & Grid), and modern JavaScript ES6+ features.',
    'Computer Science',
    'Easy',
    10,
    250,
    100,
    TRUE,
    342,
    'usr-adm-001'
  ),
  (
    'quiz-python-ds',
    'Python Data Structures & Algorithms',
    'Challenge your algorithmic thinking with time complexity, Python built-in structures, and recursion.',
    'Algorithms',
    'Medium',
    12,
    400,
    180,
    TRUE,
    189,
    'usr-adm-001'
  ),
  (
    'quiz-ai-gen',
    'Artificial Intelligence & Neural Networks',
    'Explore foundations of machine learning, loss functions, transformers, and deep learning architectures.',
    'AI & ML',
    'Hard',
    15,
    600,
    300,
    TRUE,
    124,
    'usr-adm-001'
  )
ON CONFLICT (id) DO NOTHING;

-- 5. SEED QUESTIONS FOR QUIZ 1 (Web Development)
INSERT INTO questions (id, quiz_id, question_text, correct_answer_index, explanation, difficulty, topic, order_index)
VALUES
  (
    'q-web-1',
    'quiz-web-dev-101',
    'Which HTML5 semantic element is best suited to encapsulate an independent, self-contained piece of content?',
    1,
    'The <article> tag specifies independent, self-contained content that can be distributed independently.',
    'Easy',
    'HTML5',
    0
  ),
  (
    'q-web-2',
    'quiz-web-dev-101',
    'In CSS Flexbox, which property aligns flex items along the cross axis inside the flex container?',
    1,
    'While justify-content aligns along the main axis, align-items controls alignment along the cross axis.',
    'Easy',
    'CSS3',
    1
  ),
  (
    'q-web-3',
    'quiz-web-dev-101',
    'What is the key difference between let and const declarations in modern ECMAScript?',
    2,
    'Variables declared with const cannot be reassigned another value.',
    'Easy',
    'JavaScript ES6',
    2
  )
ON CONFLICT (id) DO NOTHING;

-- 6. SEED OPTIONS FOR QUIZ 1 QUESTIONS
INSERT INTO question_options (id, question_id, option_index, option_text)
VALUES
  ('opt-w1-0', 'q-web-1', 0, '<div>'),
  ('opt-w1-1', 'q-web-1', 1, '<article>'),
  ('opt-w1-2', 'q-web-1', 2, '<section>'),
  ('opt-w1-3', 'q-web-1', 3, '<aside>'),

  ('opt-w2-0', 'q-web-2', 0, 'justify-content'),
  ('opt-w2-1', 'q-web-2', 1, 'align-items'),
  ('opt-w2-2', 'q-web-2', 2, 'flex-direction'),
  ('opt-w2-3', 'q-web-2', 3, 'align-content'),

  ('opt-w3-0', 'q-web-3', 0, 'const variables can be reassigned but not redeclared'),
  ('opt-w3-1', 'q-web-3', 1, 'let is block-scoped while const is function-scoped'),
  ('opt-w3-2', 'q-web-3', 2, 'const identifiers cannot be reassigned after initialization'),
  ('opt-w3-3', 'q-web-3', 3, 'let variables are automatically attached to the window object')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED PAST ATTEMPTS (Across Recent Days for Rolling Weekly/Monthly Leaderboards)
INSERT INTO quiz_attempts (id, user_id, quiz_id, score, total_questions, correct_count, incorrect_count, unanswered_count, percentage, time_taken_seconds, status, xp_earned, points_earned, completed_at)
VALUES
  -- Attempts within last 7 days (Weekly Leaderboard)
  ('att-001', 'usr-std-103', 'quiz-web-dev-101', 3, 3, 3, 0, 0, 100.00, 120, 'Passed', 450, 250, CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ('att-002', 'usr-std-101', 'quiz-web-dev-101', 3, 3, 3, 0, 0, 100.00, 140, 'Passed', 250, 100, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('att-003', 'usr-std-102', 'quiz-python-ds', 3, 3, 3, 0, 0, 100.00, 210, 'Passed', 400, 180, CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ('att-004', 'usr-std-104', 'quiz-ai-gen', 3, 3, 3, 0, 0, 100.00, 300, 'Passed', 600, 300, CURRENT_TIMESTAMP - INTERVAL '4 days'),
  ('att-005', 'usr-std-105', 'quiz-web-dev-101', 3, 3, 3, 0, 0, 100.00, 160, 'Passed', 250, 100, CURRENT_TIMESTAMP - INTERVAL '5 days'),

  -- Attempts within last 30 days (Monthly Leaderboard)
  ('att-006', 'usr-std-102', 'quiz-ai-gen', 3, 3, 3, 0, 0, 100.00, 280, 'Passed', 600, 300, CURRENT_TIMESTAMP - INTERVAL '12 days'),
  ('att-007', 'usr-std-103', 'quiz-python-ds', 3, 3, 3, 0, 0, 100.00, 190, 'Passed', 400, 180, CURRENT_TIMESTAMP - INTERVAL '15 days'),
  ('att-008', 'usr-std-101', 'quiz-python-ds', 3, 3, 3, 0, 0, 100.00, 220, 'Passed', 400, 180, CURRENT_TIMESTAMP - INTERVAL '18 days'),
  ('att-009', 'usr-std-106', 'quiz-web-dev-101', 3, 3, 3, 0, 0, 100.00, 175, 'Passed', 250, 100, CURRENT_TIMESTAMP - INTERVAL '22 days'),
  ('att-010', 'usr-std-107', 'quiz-python-ds', 3, 3, 3, 0, 0, 100.00, 250, 'Passed', 400, 180, CURRENT_TIMESTAMP - INTERVAL '25 days')
ON CONFLICT (id) DO NOTHING;

-- 8. SEED ATTEMPT ANSWERS FOR INITIAL ATTEMPT
INSERT INTO attempt_answers (id, attempt_id, question_id, selected_option_index, is_correct)
VALUES
  ('aa-1', 'att-002', 'q-web-1', 1, TRUE),
  ('aa-2', 'att-002', 'q-web-2', 1, TRUE),
  ('aa-3', 'att-002', 'q-web-3', 2, TRUE)
ON CONFLICT (id) DO NOTHING;

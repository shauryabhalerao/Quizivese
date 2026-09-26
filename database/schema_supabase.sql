-- ============================================================================
-- SUPABASE AUTH & PROFILES SCHEMA WITH ROW LEVEL SECURITY & AUTO-TRIGGER
-- Run this script inside your new Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. CREATE PUBLIC.PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    grade TEXT DEFAULT 'Undergraduate',
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    points INT DEFAULT 100 CHECK (points >= 0),
    xp INT DEFAULT 200 CHECK (xp >= 0),
    level INT DEFAULT 1 CHECK (level >= 1),
    current_streak INT DEFAULT 1 CHECK (current_streak >= 0),
    longest_streak INT DEFAULT 1 CHECK (longest_streak >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES FOR PUBLIC.PROFILES
-- Allow users to read their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Allow public read access to basic stats for leaderboard (name, points, xp, level, grade, role)
DROP POLICY IF EXISTS "Public leaderboard profiles view" ON public.profiles;
CREATE POLICY "Public leaderboard profiles view"
    ON public.profiles FOR SELECT
    USING (true);

-- 4. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.USERS INSERT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, grade, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        COALESCE(new.raw_user_meta_data->>'grade', 'Undergraduate'),
        'student'
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        grade = EXCLUDED.grade,
        updated_at = NOW();
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind Trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. INDEXES FOR LEADERBOARD & PROFILE LOOKUPS
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_leaderboard ON public.profiles(points DESC, xp DESC);

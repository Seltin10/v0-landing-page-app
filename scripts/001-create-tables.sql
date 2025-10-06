-- iRun MVP Database Schema
-- Core tables for users, activities, goals, coupons, and partners

-- Users table (extends neon_auth.users_sync)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  cpf TEXT UNIQUE,
  birth_date DATE,
  gender TEXT,
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'basic', 'premium', 'sports')),
  plan_expires_at TIMESTAMP WITH TIME ZONE,
  apple_health_connected BOOLEAN DEFAULT false,
  google_fit_connected BOOLEAN DEFAULT false,
  strava_connected BOOLEAN DEFAULT false,
  lgpd_consent BOOLEAN DEFAULT false,
  lgpd_consent_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table (running, cycling, swimming)
CREATE TABLE IF NOT EXISTS public.activities (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('running', 'cycling', 'swimming')),
  distance_km DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  calories_burned INTEGER,
  date DATE NOT NULL,
  source TEXT CHECK (source IN ('apple_health', 'google_fit', 'strava', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table (daily, weekly, monthly, caloric)
CREATE TABLE IF NOT EXISTS public.goals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('daily', 'weekly', 'monthly', 'caloric')),
  activity_type TEXT CHECK (activity_type IN ('running', 'cycling', 'swimming', 'any')),
  target_value DECIMAL(10,2) NOT NULL,
  target_unit TEXT NOT NULL CHECK (target_unit IN ('km', 'calories')),
  required_plan TEXT DEFAULT 'free' CHECK (required_plan IN ('free', 'basic', 'premium', 'sports')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partners table (businesses offering coupons)
CREATE TABLE IF NOT EXISTS public.partners (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  logo_url TEXT,
  category TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  goal_id INTEGER NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed', 'freebie')),
  discount_value DECIMAL(10,2),
  terms TEXT,
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  max_redemptions INTEGER,
  current_redemptions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User goals progress tracking
CREATE TABLE IF NOT EXISTS public.user_goal_progress (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  goal_id INTEGER NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  target_value DECIMAL(10,2) NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, goal_id, period_start)
);

-- User coupon redemptions
CREATE TABLE IF NOT EXISTS public.user_coupons (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  coupon_id INTEGER NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  goal_progress_id INTEGER REFERENCES public.user_goal_progress(id),
  redemption_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'used', 'expired')),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  validated_by INTEGER REFERENCES public.partners(id)
);

-- Admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id SERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON public.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON public.activities(date);
CREATE INDEX IF NOT EXISTS idx_user_goal_progress_user_id ON public.user_goal_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coupons_user_id ON public.user_coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coupons_status ON public.user_coupons(status);

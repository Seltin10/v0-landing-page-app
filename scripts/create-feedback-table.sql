-- Create feedback table to store user feedback responses
CREATE TABLE IF NOT EXISTS public.user_feedback (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Eixo 1: Motivação e Engajamento
  motivation_scale INTEGER CHECK (motivation_scale BETWEEN 1 AND 5),
  reward_ranking JSONB, -- Array of ranked reward types
  
  -- Eixo 2: Proposta de Valor
  value_perception INTEGER CHECK (value_perception BETWEEN 1 AND 5),
  partner_importance INTEGER CHECK (partner_importance BETWEEN 1 AND 5),
  
  -- Eixo 3: Experiência do Usuário (UX)
  ease_of_use INTEGER CHECK (ease_of_use BETWEEN 1 AND 5),
  favorite_feature TEXT,
  improvement_suggestion TEXT,
  
  -- Eixo 4: Modelo de Negócio
  payment_willingness VARCHAR(50),
  acceptable_price_range VARCHAR(50),
  
  -- Eixo 5: Diferenciação e Competitividade
  competitor_comparison TEXT,
  unique_feature TEXT,
  
  -- Eixo 6: Viabilidade e Escalabilidade
  recommendation_likelihood INTEGER CHECK (recommendation_likelihood BETWEEN 0 AND 10),
  usage_frequency VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id) -- One feedback per user
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON public.user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON public.user_feedback(created_at);

# Documentação do Banco de Dados - iRun Clube+

## 📊 Visão Geral

O iRun utiliza PostgreSQL (Neon) como banco de dados principal. O schema foi projetado para suportar:

- Gerenciamento de usuários e autenticação
- Rastreamento de atividades físicas
- Sistema de metas e progresso
- Cupons e recompensas
- Parceiros comerciais
- Painel administrativo

## 🗂️ Tabelas

### users

Armazena informações dos usuários da plataforma.

\`\`\`sql
CREATE TABLE public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  cpf TEXT UNIQUE,
  birth_date DATE,
  gender TEXT,
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  plan_type TEXT DEFAULT 'free',
  plan_expires_at TIMESTAMP WITH TIME ZONE,
  apple_health_connected BOOLEAN DEFAULT false,
  google_fit_connected BOOLEAN DEFAULT false,
  strava_connected BOOLEAN DEFAULT false,
  lgpd_consent BOOLEAN DEFAULT false,
  lgpd_consent_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Campos Principais:**
- `plan_type`: Tipo de plano (free, basic, premium, sports)
- `*_connected`: Status de integração com apps de fitness
- `lgpd_consent`: Consentimento LGPD obrigatório

### activities

Registra todas as atividades físicas dos usuários.

\`\`\`sql
CREATE TABLE public.activities (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  activity_type TEXT NOT NULL,
  distance_km DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  calories_burned INTEGER,
  date DATE NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Tipos de Atividade:**
- `running`: Corrida
- `cycling`: Ciclismo
- `swimming`: Natação

**Fontes:**
- `apple_health`: Apple Health
- `google_fit`: Google Fit
- `strava`: Strava
- `manual`: Registro manual

### goals

Define as metas disponíveis na plataforma.

\`\`\`sql
CREATE TABLE public.goals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL,
  activity_type TEXT,
  target_value DECIMAL(10,2) NOT NULL,
  target_unit TEXT NOT NULL,
  required_plan TEXT DEFAULT 'free',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Tipos de Meta:**
- `daily`: Meta diária
- `weekly`: Meta semanal
- `monthly`: Meta mensal
- `caloric`: Meta calórica

### partners

Estabelecimentos parceiros que oferecem cupons.

\`\`\`sql
CREATE TABLE public.partners (
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
\`\`\`

**Categorias:**
- Restaurantes
- Lojas Esportivas
- Roupas e Vestuário
- Suplementos
- Eventos
- Serviços Gerais
- Saúde e Beleza

### coupons

Cupons de desconto oferecidos pelos parceiros.

\`\`\`sql
CREATE TABLE public.coupons (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER NOT NULL REFERENCES partners(id),
  goal_id INTEGER NOT NULL REFERENCES goals(id),
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT,
  discount_value DECIMAL(10,2),
  terms TEXT,
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  max_redemptions INTEGER,
  current_redemptions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Tipos de Desconto:**
- `percentage`: Desconto percentual
- `fixed`: Valor fixo de desconto
- `freebie`: Brinde/item grátis

### user_goal_progress

Rastreia o progresso dos usuários nas metas.

\`\`\`sql
CREATE TABLE public.user_goal_progress (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  goal_id INTEGER NOT NULL REFERENCES goals(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  target_value DECIMAL(10,2) NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, goal_id, period_start)
);
\`\`\`

### user_coupons

Cupons conquistados e resgatados pelos usuários.

\`\`\`sql
CREATE TABLE public.user_coupons (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  coupon_id INTEGER NOT NULL REFERENCES coupons(id),
  goal_progress_id INTEGER REFERENCES user_goal_progress(id),
  redemption_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'available',
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  validated_by INTEGER REFERENCES partners(id)
);
\`\`\`

**Status:**
- `available`: Disponível para uso
- `used`: Já utilizado
- `expired`: Expirado

### admins

Usuários com permissões administrativas.

\`\`\`sql
CREATE TABLE public.admins (
  id SERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id),
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## 🔗 Relacionamentos

\`\`\`
users (1) ──── (N) activities
users (1) ──── (N) user_goal_progress
users (1) ──── (N) user_coupons
users (1) ──── (1) admins

goals (1) ──── (N) user_goal_progress
goals (1) ──── (N) coupons

partners (1) ──── (N) coupons
partners (1) ──── (N) user_coupons (validated_by)

coupons (1) ──── (N) user_coupons

user_goal_progress (1) ──── (N) user_coupons
\`\`\`

## 📈 Índices

Para otimização de performance:

\`\`\`sql
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_date ON activities(date);
CREATE INDEX idx_user_goal_progress_user_id ON user_goal_progress(user_id);
CREATE INDEX idx_user_coupons_user_id ON user_coupons(user_id);
CREATE INDEX idx_user_coupons_status ON user_coupons(status);
\`\`\`

## 🔄 Migrations

Os scripts SQL estão em `/scripts`:

1. `001-create-tables.sql`: Cria todas as tabelas
2. `002-seed-initial-data.sql`: Dados iniciais (metas padrão)
3. `003-create-admin-user.sql`: Cria usuário admin

## 💡 Queries Comuns

### Buscar atividades de um usuário

\`\`\`sql
SELECT * FROM activities 
WHERE user_id = $1 
ORDER BY date DESC 
LIMIT 10;
\`\`\`

### Calcular progresso de meta

\`\`\`sql
SELECT 
  g.title,
  ugp.current_value,
  ugp.target_value,
  (ugp.current_value / ugp.target_value * 100) as progress_percentage
FROM user_goal_progress ugp
JOIN goals g ON g.id = ugp.goal_id
WHERE ugp.user_id = $1 AND ugp.is_completed = false;
\`\`\`

### Listar cupons disponíveis

\`\`\`sql
SELECT 
  c.*,
  p.name as partner_name,
  p.logo_url as partner_logo
FROM coupons c
JOIN partners p ON p.id = c.partner_id
WHERE c.is_active = true 
  AND c.valid_until >= CURRENT_DATE
  AND c.current_redemptions < c.max_redemptions;
\`\`\`

---

Para mais informações, consulte os scripts SQL em `/scripts`.

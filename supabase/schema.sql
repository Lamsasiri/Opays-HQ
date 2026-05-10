-- SCHEMA DE BASE POUR OPAYS HQ

-- 1. Table des Associés (Profils & Rôles)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('CEO', 'COO', 'CTO', 'SALES', 'INVESTOR')),
  equity_percent FLOAT DEFAULT 0,
  vesting_start_date DATE,
  avatar_url TEXT,
  PRIMARY KEY (id)
);

-- 2. Table des Leads (CRM)
CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT CHECK (status IN ('NEW', 'CONTACTED', 'AUDIT_PENDING', 'PROPOSAL_SENT', 'CLOSED_WON', 'CLOSED_LOST')) DEFAULT 'NEW',
  potential_value FLOAT,
  assigned_to UUID REFERENCES profiles(id)
);

-- 3. Table des Projets (Audits & Dev)
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('PLANNING', 'IN_PROGRESS', 'TESTING', 'COMPLETED')) DEFAULT 'PLANNING',
  tech_stack TEXT[],
  due_date DATE,
  client_feedback TEXT
);

-- 4. Table des Parts Sociales (Tracking)
CREATE TABLE equity_milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),
  milestone_name TEXT,
  shares_awarded FLOAT,
  achieved_at TIMESTAMP WITH TIME ZONE
);

-- 5. Système d'Invitations (Modèle Kiveclair)
CREATE TABLE invitations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  invited_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- 6. Espace Audit IA (Le Cœur Technique)
CREATE TABLE ai_audits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  raw_data_url TEXT, -- Lien vers le fichier uploadé (S3/Supabase Storage)
  ai_analysis JSONB, -- Résultats de l'analyse IA (Frictions, ROI)
  status TEXT CHECK (status IN ('PENDING', 'ANALYZING', 'COMPLETED', 'FAILED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

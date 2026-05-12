-- Table for ROI Simulations
CREATE TABLE IF NOT EXISTS roi_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    sector TEXT,
    salary_monthly NUMERIC,
    hours_lost_weekly NUMERIC,
    deal_value NUMERIC,
    deals_lost_monthly NUMERIC,
    total_leak_annual NUMERIC,
    net_gain_annual NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Table for Associate Documents (Legal/Personal)
CREATE TABLE IF NOT EXISTS associate_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    type TEXT DEFAULT 'LEGAL', -- LEGAL, CONTRACT, IDENTITY
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE roi_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE associate_documents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own simulations" ON roi_simulations FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Admins can view all simulations" ON roi_simulations FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('CEO', 'COO', 'ADMIN'))
);
CREATE POLICY "Users can create simulations" ON roi_simulations FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view their own documents" ON associate_documents FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Admins can view all documents" ON associate_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('CEO', 'COO', 'ADMIN'))
);
CREATE POLICY "Admins can upload documents" ON associate_documents FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('CEO', 'COO', 'ADMIN'))
);

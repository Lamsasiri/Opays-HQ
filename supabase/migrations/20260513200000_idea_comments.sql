-- Migration pour ajouter les commentaires sur les idées
CREATE TABLE IF NOT EXISTS idea_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE idea_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "idea_comments_select_all" ON idea_comments;
CREATE POLICY "idea_comments_select_all" ON idea_comments
  FOR SELECT TO authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "idea_comments_insert_self" ON idea_comments;
CREATE POLICY "idea_comments_insert_self" ON idea_comments
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_idea_comments_idea_id ON idea_comments(idea_id, created_at DESC);

-- ============================================================
-- CEO-centric access model
-- Date: 14 mai 2026
-- ============================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION app_private.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND lower(email) = 'lamsasfenelon@gmail.com'
      AND is_admin = TRUE
  )
$$;

CREATE OR REPLACE FUNCTION app_private.has_permission(module_id TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT app_private.is_admin()
    OR COALESCE(
      (
        SELECT (permissions ->> module_id)::BOOLEAN
        FROM profiles
        WHERE id = auth.uid()
      ),
      FALSE
    )
$$;

CREATE OR REPLACE FUNCTION public.enforce_single_ceo_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.is_admin := lower(COALESCE(NEW.email, '')) = 'lamsasfenelon@gmail.com';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_single_ceo_admin ON profiles;
CREATE TRIGGER trg_enforce_single_ceo_admin
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_single_ceo_admin();

CREATE OR REPLACE FUNCTION public.apply_initial_ceo_permissions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'zamwanapatricia@gmail.com' THEN
    UPDATE profiles
    SET permissions = '{
      "leads": true,
      "studio": true,
      "coordination": true,
      "projects": true,
      "tasks": true,
      "knowledge": true,
      "calendar": true,
      "treasury": true
    }'::jsonb
    WHERE id = NEW.id;
  ELSIF lower(NEW.email) = 'zainagodlive28@gmail.com' THEN
    UPDATE profiles
    SET permissions = '{
      "leads": true,
      "studio": true,
      "coordination": true,
      "projects": true,
      "tasks": true,
      "knowledge": true,
      "calendar": true,
      "brand": true
    }'::jsonb
    WHERE id = NEW.id;
  ELSIF lower(NEW.email) = 'princebagheni@gmail.com' THEN
    UPDATE profiles
    SET permissions = '{
      "coordination": true,
      "projects": true,
      "tasks": true
    }'::jsonb
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_apply_initial_ceo_permissions ON profiles;
CREATE TRIGGER trg_apply_initial_ceo_permissions
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.apply_initial_ceo_permissions();

UPDATE profiles
SET is_admin = (lower(email) = 'lamsasfenelon@gmail.com');

UPDATE profiles
SET permissions = '{}'::jsonb
WHERE lower(email) NOT IN (
  'lamsasfenelon@gmail.com',
  'zamwanapatricia@gmail.com',
  'zainagodlive28@gmail.com',
  'princebagheni@gmail.com'
);

UPDATE profiles
SET full_name = COALESCE(NULLIF(full_name, ''), 'Zaina Godlive'),
    role = 'SALES',
    type = 'ASSOCIATE',
    equity_percent = COALESCE(NULLIF(equity_percent, 0), 8),
    is_admin = FALSE
WHERE lower(email) = 'zainagodlive28@gmail.com';

INSERT INTO invitations (
  email, full_name, role, type, token, equity_granted, salary_granted, invited_by, expires_at
)
SELECT
  'zainagodlive28@gmail.com',
  'Zaina Godlive',
  'SALES',
  'ASSOCIATE',
  uuid_generate_v4()::text,
  8,
  0,
  (SELECT id FROM profiles WHERE lower(email) = 'lamsasfenelon@gmail.com' LIMIT 1),
  NOW() + INTERVAL '30 days'
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE lower(email) = 'zainagodlive28@gmail.com'
)
AND NOT EXISTS (
  SELECT 1 FROM invitations
  WHERE lower(email) = 'zainagodlive28@gmail.com'
    AND accepted_at IS NULL
    AND (expires_at IS NULL OR expires_at > NOW())
);

UPDATE profiles
SET permissions = '{
  "leads": true,
  "studio": true,
  "coordination": true,
  "projects": true,
  "tasks": true,
  "knowledge": true,
  "calendar": true,
  "treasury": true
}'::jsonb,
is_admin = FALSE
WHERE lower(email) = 'zamwanapatricia@gmail.com';

UPDATE profiles
SET permissions = '{
  "leads": true,
  "studio": true,
  "coordination": true,
  "projects": true,
  "tasks": true,
  "knowledge": true,
  "calendar": true,
  "brand": true
}'::jsonb,
is_admin = FALSE
WHERE lower(email) = 'zainagodlive28@gmail.com';

UPDATE profiles
SET permissions = '{
  "coordination": true,
  "projects": true,
  "tasks": true
}'::jsonb,
is_admin = FALSE
WHERE lower(email) = 'princebagheni@gmail.com';

UPDATE profiles
SET permissions = '{}'::jsonb,
    is_admin = TRUE
WHERE lower(email) = 'lamsasfenelon@gmail.com';

ALTER TABLE global_documents
  ADD COLUMN IF NOT EXISTS shared_with_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_global_documents_shared_with
  ON global_documents(shared_with_profile_id, created_at DESC);

-- Profiles: visibility is narrow by default. Fenelon sees all; users see self.
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_select_self_or_admin" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;

CREATE POLICY "profiles_select_self_or_ceo" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR app_private.is_admin());

-- Sensitive and business tables: no role-based automatic access.
DROP POLICY IF EXISTS "leads_select_sales_or_assignee" ON leads;
DROP POLICY IF EXISTS "leads_insert_sales" ON leads;
DROP POLICY IF EXISTS "leads_update_sales_or_assignee" ON leads;

CREATE POLICY "leads_select_permission_or_assignee" ON leads
  FOR SELECT TO authenticated
  USING (app_private.has_permission('leads') OR assigned_to = auth.uid());

CREATE POLICY "leads_insert_permission" ON leads
  FOR INSERT TO authenticated
  WITH CHECK (app_private.has_permission('leads'));

CREATE POLICY "leads_update_permission_or_assignee" ON leads
  FOR UPDATE TO authenticated
  USING (app_private.has_permission('leads') OR assigned_to = auth.uid())
  WITH CHECK (app_private.has_permission('leads') OR assigned_to = auth.uid());

DROP POLICY IF EXISTS "projects_select_associates_or_task_members" ON projects;
DROP POLICY IF EXISTS "projects_write_delivery_leads" ON projects;

CREATE POLICY "projects_select_permission_or_task_member" ON projects
  FOR SELECT TO authenticated
  USING (
    app_private.has_permission('projects')
    OR EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.project_id = projects.id
        AND tasks.assigned_to = auth.uid()
    )
  );

CREATE POLICY "projects_write_permission" ON projects
  FOR ALL TO authenticated
  USING (app_private.has_permission('projects'))
  WITH CHECK (app_private.has_permission('projects'));

DROP POLICY IF EXISTS "tasks_select_assigned_or_ops" ON tasks;
DROP POLICY IF EXISTS "tasks_insert_ops" ON tasks;
DROP POLICY IF EXISTS "tasks_update_assigned_or_ops" ON tasks;

CREATE POLICY "tasks_select_permission_or_assigned" ON tasks
  FOR SELECT TO authenticated
  USING (app_private.has_permission('tasks') OR assigned_to = auth.uid());

CREATE POLICY "tasks_insert_permission" ON tasks
  FOR INSERT TO authenticated
  WITH CHECK (app_private.has_permission('tasks'));

CREATE POLICY "tasks_update_permission_or_assigned" ON tasks
  FOR UPDATE TO authenticated
  USING (app_private.has_permission('tasks') OR assigned_to = auth.uid())
  WITH CHECK (app_private.has_permission('tasks') OR assigned_to = auth.uid());

DROP POLICY IF EXISTS "treasury_select_admin_only" ON treasury_logs;
DROP POLICY IF EXISTS "treasury_write_admin_only" ON treasury_logs;
DROP POLICY IF EXISTS "treasury_select_founders" ON treasury_logs;
DROP POLICY IF EXISTS "treasury_write_founders" ON treasury_logs;

CREATE POLICY "treasury_select_ceo_or_permission" ON treasury_logs
  FOR SELECT TO authenticated
  USING (app_private.has_permission('treasury'));

CREATE POLICY "treasury_write_ceo_or_permission" ON treasury_logs
  FOR ALL TO authenticated
  USING (app_private.has_permission('treasury'))
  WITH CHECK (app_private.has_permission('treasury'));

DROP POLICY IF EXISTS "hr_records_select_owner_or_ops" ON hr_records;
DROP POLICY IF EXISTS "hr_records_write_ops" ON hr_records;
DROP POLICY IF EXISTS "hr_records_select_owner_or_admin" ON hr_records;
DROP POLICY IF EXISTS "hr_records_write_admin_only" ON hr_records;

CREATE POLICY "hr_records_select_owner_or_ceo" ON hr_records
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR app_private.is_admin());

CREATE POLICY "hr_records_write_ceo_only" ON hr_records
  FOR ALL TO authenticated
  USING (app_private.is_admin())
  WITH CHECK (app_private.is_admin());

DROP POLICY IF EXISTS "project_contracts_select_associates" ON project_contracts;
DROP POLICY IF EXISTS "project_contracts_write_founders" ON project_contracts;
DROP POLICY IF EXISTS "project_billing_select_associates" ON project_billing;
DROP POLICY IF EXISTS "project_billing_write_founders" ON project_billing;

CREATE POLICY "project_contracts_select_permission" ON project_contracts
  FOR SELECT TO authenticated
  USING (app_private.has_permission('contracts'));

CREATE POLICY "project_contracts_write_permission" ON project_contracts
  FOR ALL TO authenticated
  USING (app_private.has_permission('contracts'))
  WITH CHECK (app_private.has_permission('contracts'));

CREATE POLICY "project_billing_select_permission" ON project_billing
  FOR SELECT TO authenticated
  USING (app_private.has_permission('contracts') OR app_private.has_permission('treasury'));

CREATE POLICY "project_billing_write_permission" ON project_billing
  FOR ALL TO authenticated
  USING (app_private.has_permission('contracts') OR app_private.has_permission('treasury'))
  WITH CHECK (app_private.has_permission('contracts') OR app_private.has_permission('treasury'));

DROP POLICY IF EXISTS "global_documents_select_visible" ON global_documents;
DROP POLICY IF EXISTS "global_documents_write_admin" ON global_documents;

CREATE POLICY "global_documents_select_ceo_or_target_or_brand" ON global_documents
  FOR SELECT TO authenticated
  USING (
    app_private.is_admin()
    OR uploaded_by = auth.uid()
    OR shared_with_profile_id = auth.uid()
    OR (
      category IN ('BRAND', 'COMM')
      AND app_private.has_permission('brand')
    )
  );

CREATE POLICY "global_documents_write_ceo_only" ON global_documents
  FOR ALL TO authenticated
  USING (app_private.is_admin())
  WITH CHECK (app_private.is_admin());

DROP POLICY IF EXISTS "associate_documents_select_owner_or_admin" ON associate_documents;
DROP POLICY IF EXISTS "associate_documents_write_admin" ON associate_documents;
DROP POLICY IF EXISTS "Users can view their own documents" ON associate_documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON associate_documents;
DROP POLICY IF EXISTS "Admins can upload documents" ON associate_documents;

CREATE POLICY "associate_documents_select_owner_or_ceo" ON associate_documents
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR app_private.is_admin());

CREATE POLICY "associate_documents_write_ceo_only" ON associate_documents
  FOR ALL TO authenticated
  USING (app_private.is_admin())
  WITH CHECK (app_private.is_admin());

DROP POLICY IF EXISTS "partnerships_select_associates" ON partnerships;
DROP POLICY IF EXISTS "partnerships_write_founders" ON partnerships;

CREATE POLICY "partnerships_select_permission" ON partnerships
  FOR SELECT TO authenticated
  USING (app_private.has_permission('treasury') OR app_private.has_permission('coordination'));

CREATE POLICY "partnerships_write_permission" ON partnerships
  FOR ALL TO authenticated
  USING (app_private.has_permission('treasury') OR app_private.has_permission('coordination'))
  WITH CHECK (app_private.has_permission('treasury') OR app_private.has_permission('coordination'));

DROP POLICY IF EXISTS "knowledge_select_by_role" ON knowledge_articles;
DROP POLICY IF EXISTS "knowledge_write_admin" ON knowledge_articles;

CREATE POLICY "knowledge_select_permission" ON knowledge_articles
  FOR SELECT TO authenticated
  USING (app_private.has_permission('knowledge'));

CREATE POLICY "knowledge_write_ceo_only" ON knowledge_articles
  FOR ALL TO authenticated
  USING (app_private.is_admin())
  WITH CHECK (app_private.is_admin());

DROP POLICY IF EXISTS "equity_select_owner_or_founders" ON equity_vesting_logs;
DROP POLICY IF EXISTS "equity_write_founders" ON equity_vesting_logs;

CREATE POLICY "equity_select_owner_or_ceo" ON equity_vesting_logs
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR app_private.is_admin());

CREATE POLICY "equity_write_ceo_only" ON equity_vesting_logs
  FOR ALL TO authenticated
  USING (app_private.is_admin())
  WITH CHECK (app_private.is_admin());

DROP POLICY IF EXISTS "ai_audits_select_project_authorized" ON ai_audits;
DROP POLICY IF EXISTS "ai_audits_write_sales_delivery" ON ai_audits;

CREATE POLICY "ai_audits_select_permission_or_project_member" ON ai_audits
  FOR SELECT TO authenticated
  USING (
    app_private.has_permission('audit')
    OR EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.project_id = ai_audits.project_id
        AND tasks.assigned_to = auth.uid()
    )
  );

CREATE POLICY "ai_audits_write_permission" ON ai_audits
  FOR ALL TO authenticated
  USING (app_private.has_permission('audit'))
  WITH CHECK (app_private.has_permission('audit'));

DROP POLICY IF EXISTS "ideas_select_authenticated" ON ideas;
DROP POLICY IF EXISTS "ideas_insert_self" ON ideas;
DROP POLICY IF EXISTS "ideas_update_owner_or_admin" ON ideas;

CREATE POLICY "ideas_select_permission_or_owner" ON ideas
  FOR SELECT TO authenticated
  USING (app_private.has_permission('ideas') OR profile_id = auth.uid());

CREATE POLICY "ideas_insert_permission_self" ON ideas
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid() AND app_private.has_permission('ideas'));

CREATE POLICY "ideas_update_permission_or_owner" ON ideas
  FOR UPDATE TO authenticated
  USING (app_private.has_permission('ideas') OR profile_id = auth.uid())
  WITH CHECK (app_private.has_permission('ideas') OR profile_id = auth.uid());

-- Invitations and admin RPC remain Fenelon-only through app_private.is_admin().
DROP POLICY IF EXISTS "invitations_admin_only" ON invitations;
CREATE POLICY "invitations_admin_only" ON invitations
  FOR ALL TO authenticated
  USING (app_private.is_admin())
  WITH CHECK (app_private.is_admin());

DROP POLICY IF EXISTS "Authenticated users can upload assets" ON storage.objects;
DROP POLICY IF EXISTS "CEO can upload brand assets" ON storage.objects;
DROP POLICY IF EXISTS "Owners can delete assets" ON storage.objects;
DROP POLICY IF EXISTS "CEO can delete brand assets" ON storage.objects;

CREATE POLICY "CEO can upload brand assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'brand-assets'
  AND app_private.is_admin()
);

CREATE POLICY "CEO can delete brand assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'brand-assets'
  AND app_private.is_admin()
);

COMMIT;

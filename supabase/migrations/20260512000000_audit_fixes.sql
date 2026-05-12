-- ============================================================
-- MIGRATION: Audit Fixes (12 mai 2026)
-- Corrige les problèmes identifiés dans l'audit HQ
-- ============================================================

-- 1. Ajouter le champ permissions manquant dans profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}';

-- 2. Ajouter updated_at sur profiles et projects
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);

-- 3. Ajouter created_by et updated_at sur tasks
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Créer la table de notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('TASK_ASSIGNED', 'TASK_UPDATED', 'LEAD_NEW', 'PROJECT_NEW', 'COMMENT', 'SYSTEM')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  href TEXT, -- Lien vers la ressource (ex: /dashboard/tasks)
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "notifications_insert_system" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (TRUE); -- Tout utilisateur authentifié peut créer une notification pour un autre

CREATE POLICY "notifications_delete_own" ON notifications
  FOR DELETE TO authenticated
  USING (profile_id = auth.uid());

CREATE INDEX idx_notifications_profile_read ON notifications(profile_id, is_read, created_at DESC);

-- 5. Créer la table activity_log pour le flux d'activité
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL, -- 'CREATED', 'UPDATED', 'DELETED', 'STATUS_CHANGED'
  entity_type TEXT NOT NULL, -- 'LEAD', 'PROJECT', 'TASK', 'BILLING'
  entity_id UUID,
  entity_title TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity_log_select_authenticated" ON activity_log
  FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "activity_log_insert_authenticated" ON activity_log
  FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);

-- 6. Trigger auto updated_at sur profiles, projects, tasks
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_profiles_updated_at') THEN
    CREATE TRIGGER trg_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_projects_updated_at') THEN
    CREATE TRIGGER trg_projects_updated_at
      BEFORE UPDATE ON projects
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_tasks_updated_at') THEN
    CREATE TRIGGER trg_tasks_updated_at
      BEFORE UPDATE ON tasks
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
  END IF;
END $$;

-- 7. Fix handle_new_user : lookup invitation avant d'assigner un role par defaut
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  user_email text := lower(new.email);
  inv RECORD;
  user_role text;
  user_type text;
  user_is_admin boolean;
  user_equity float;
  user_salary float;
  user_vesting date;
BEGIN
  -- Étape 1 : Chercher une invitation existante pour cet email
  SELECT * INTO inv FROM invitations WHERE lower(email) = user_email AND accepted_at IS NULL LIMIT 1;

  IF inv IS NOT NULL THEN
    -- Utiliser les données de l'invitation
    user_role := inv.role;
    user_type := COALESCE(inv.type, 'ASSOCIATE');
    user_is_admin := inv.role IN ('CEO', 'COO', 'ADMIN');
    user_equity := COALESCE(inv.equity_granted, 0);
    user_salary := COALESCE(inv.salary_granted, 0);
    user_vesting := CURRENT_DATE;

    -- Marquer l'invitation comme acceptée
    UPDATE invitations SET accepted_at = NOW() WHERE id = inv.id;
  ELSE
    -- Fallback : mapping par email pour les comptes fondateurs
    user_role := CASE user_email
      WHEN 'ceo@opays.tech' THEN 'CEO'
      WHEN 'coo@opays.tech' THEN 'COO'
      WHEN 'admin@opays.tech' THEN 'ADMIN'
      WHEN 'sales@opays.tech' THEN 'SALES'
      WHEN 'engineer@opays.tech' THEN 'ENGINEER'
      WHEN 'associate@opays.tech' THEN 'CTO'
      WHEN 'employee@opays.tech' THEN 'ENGINEER'
      ELSE 'ENGINEER'
    END;

    user_type := CASE user_email
      WHEN 'engineer@opays.tech' THEN 'EMPLOYEE'
      WHEN 'employee@opays.tech' THEN 'EMPLOYEE'
      ELSE 'ASSOCIATE'
    END;

    user_is_admin := user_email IN ('ceo@opays.tech', 'coo@opays.tech', 'admin@opays.tech');
    user_equity := CASE user_email
      WHEN 'ceo@opays.tech' THEN 22.0
      WHEN 'coo@opays.tech' THEN 12.0
      WHEN 'sales@opays.tech' THEN 8.0
      WHEN 'associate@opays.tech' THEN 18.0
      ELSE 0.0
    END;
    user_salary := CASE user_email
      WHEN 'engineer@opays.tech' THEN 3200.0
      WHEN 'employee@opays.tech' THEN 2400.0
      ELSE 0.0
    END;
    user_vesting := CURRENT_DATE;
  END IF;

  INSERT INTO public.profiles (
    id, full_name, email, type, role, is_admin, equity_percent, salary_amount, vesting_start_date, permissions
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    user_type,
    user_role,
    user_is_admin,
    user_equity,
    user_salary,
    user_vesting,
    '{}'::jsonb
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    type = EXCLUDED.type,
    role = EXCLUDED.role,
    is_admin = EXCLUDED.is_admin,
    equity_percent = EXCLUDED.equity_percent,
    salary_amount = EXCLUDED.salary_amount,
    vesting_start_date = EXCLUDED.vesting_start_date;

  RETURN new;
END;
$function$;

-- 8. Trigger pour créer une notification quand une tâche est assignée
CREATE OR REPLACE FUNCTION public.notify_task_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.assigned_to IS NOT NULL AND (OLD IS NULL OR OLD.assigned_to IS DISTINCT FROM NEW.assigned_to) THEN
    INSERT INTO notifications (profile_id, type, title, message, href)
    VALUES (
      NEW.assigned_to,
      'TASK_ASSIGNED',
      'Nouvelle tâche assignée',
      NEW.title,
      '/dashboard/tasks'
    );
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_notify_task_assignment') THEN
    CREATE TRIGGER trg_notify_task_assignment
      AFTER INSERT OR UPDATE ON tasks
      FOR EACH ROW EXECUTE FUNCTION public.notify_task_assignment();
  END IF;
END $$;

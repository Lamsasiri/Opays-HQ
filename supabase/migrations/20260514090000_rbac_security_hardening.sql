-- ============================================================
-- RBAC security hardening: profiles UPDATE, sensitive RLS and admin RPC
-- Date: 14 mai 2026
-- ============================================================

BEGIN;

-- Source de vérité unique pour les décisions admin côté RLS.
CREATE OR REPLACE FUNCTION app_private.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (
      SELECT is_admin OR role IN ('CEO', 'COO', 'ADMIN')
      FROM profiles
      WHERE id = auth.uid()
    ),
    FALSE
  )
$$;

-- Les utilisateurs authentifiés ne peuvent modifier directement que leur identité publique.
-- Les colonnes sensibles passent par des RPC SECURITY DEFINER contrôlées.
REVOKE UPDATE ON TABLE profiles FROM authenticated;
GRANT UPDATE (full_name, avatar_url) ON TABLE profiles TO authenticated;

DROP POLICY IF EXISTS "profiles_update_self_limited_or_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile or admins can update all" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "profiles_update_public_identity_or_admin" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR app_private.is_admin())
  WITH CHECK (id = auth.uid() OR app_private.is_admin());

-- Tables sensibles: pas d'accès élargi via REST, uniquement owner/admin selon le cas.
DROP POLICY IF EXISTS "treasury_select_founders" ON treasury_logs;
DROP POLICY IF EXISTS "treasury_write_founders" ON treasury_logs;

CREATE POLICY "treasury_select_admin_only" ON treasury_logs
  FOR SELECT TO authenticated
  USING (app_private.is_admin());

CREATE POLICY "treasury_write_admin_only" ON treasury_logs
  FOR ALL TO authenticated
  USING (app_private.is_admin())
  WITH CHECK (app_private.is_admin());

DROP POLICY IF EXISTS "invitations_admin_only" ON invitations;

CREATE POLICY "invitations_admin_only" ON invitations
  FOR ALL TO authenticated
  USING (app_private.is_admin())
  WITH CHECK (app_private.is_admin());

DROP POLICY IF EXISTS "hr_records_select_owner_or_ops" ON hr_records;
DROP POLICY IF EXISTS "hr_records_write_ops" ON hr_records;

CREATE POLICY "hr_records_select_owner_or_admin" ON hr_records
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR app_private.is_admin());

CREATE POLICY "hr_records_write_admin_only" ON hr_records
  FOR ALL TO authenticated
  USING (app_private.is_admin())
  WITH CHECK (app_private.is_admin());

-- RPC: modifier les permissions sans exposer UPDATE permissions sur profiles.
CREATE OR REPLACE FUNCTION public.admin_update_profile_permissions(
  target_profile_id UUID,
  next_permissions JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT app_private.is_admin() THEN
    RAISE EXCEPTION 'RBAC_FORBIDDEN';
  END IF;

  IF target_profile_id = auth.uid() THEN
    RAISE EXCEPTION 'RBAC_SELF_PERMISSION_CHANGE_FORBIDDEN';
  END IF;

  IF next_permissions IS NULL OR jsonb_typeof(next_permissions) <> 'object' THEN
    RAISE EXCEPTION 'RBAC_INVALID_PERMISSIONS_PAYLOAD';
  END IF;

  UPDATE profiles
  SET permissions = next_permissions,
      updated_at = NOW()
  WHERE id = target_profile_id;
END;
$$;

-- RPC: attribution equity contrôlée, sans UPDATE direct sur equity_percent/type.
CREATE OR REPLACE FUNCTION public.admin_update_profile_equity(
  target_profile_id UUID,
  next_equity_percent NUMERIC
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT app_private.is_admin() THEN
    RAISE EXCEPTION 'RBAC_FORBIDDEN';
  END IF;

  IF next_equity_percent < 0 OR next_equity_percent > 100 THEN
    RAISE EXCEPTION 'RBAC_INVALID_EQUITY_PERCENT';
  END IF;

  UPDATE profiles
  SET equity_percent = next_equity_percent,
      type = 'ASSOCIATE',
      updated_at = NOW()
  WHERE id = target_profile_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_profile_permissions(UUID, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_update_profile_equity(UUID, NUMERIC) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_profile_permissions(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_profile_equity(UUID, NUMERIC) TO authenticated;

-- Storage brand assets: aligner la décision admin sur app_private.is_admin().
DROP POLICY IF EXISTS "Owners can delete assets" ON storage.objects;
CREATE POLICY "Owners can delete assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'brand-assets'
  AND (owner = auth.uid() OR app_private.is_admin())
);

COMMIT;

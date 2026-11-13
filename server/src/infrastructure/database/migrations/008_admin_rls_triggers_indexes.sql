-- =============================================================================
-- 008: Admin-only RLS, updated_at trigger, indexes & unique constraints
--
-- BEFORE RUNNING:
--   1. Check the admin e-mail(s) inserted into private.admin_users below.
--   2. Disable public sign-ups: Supabase Dashboard → Authentication →
--      Sign In / Providers → turn off "Allow new users to sign up".
--
-- The Express backend uses the service-role key (bypasses RLS). These policies
-- protect direct access with the public anon key exposed in the frontend.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Admin allowlist
-- ---------------------------------------------------------------------------
-- Kept in a non-exposed schema so neither the table nor the SECURITY DEFINER
-- helper is reachable through the Data API.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;

CREATE TABLE IF NOT EXISTS private.admin_users (
  email TEXT PRIMARY KEY
);
ALTER TABLE private.admin_users ENABLE ROW LEVEL SECURITY; -- defense in depth

INSERT INTO private.admin_users (email) VALUES ('ahmadsanijabarulloh.02@gmail.com')
ON CONFLICT DO NOTHING;

-- SECURITY DEFINER is required to read private.admin_users from a policy.
-- It only answers "is the caller's own verified JWT e-mail an admin?".
CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM private.admin_users
    WHERE lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

REVOKE EXECUTE ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;

-- ---------------------------------------------------------------------------
-- 2. Replace "any authenticated user" policies with admin-only policies.
--    `TO authenticated` excludes anon; `(select ...)` evaluates once per query.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin can do all" ON public.projects;
DROP POLICY IF EXISTS "Admin can do all" ON public.projects;
CREATE POLICY "Admin can do all" ON public.projects FOR ALL TO authenticated
  USING ((SELECT private.is_admin())) WITH CHECK ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "Admin can do all" ON public.certificates;
DROP POLICY IF EXISTS "Admin can do all" ON public.certificates;
CREATE POLICY "Admin can do all" ON public.certificates FOR ALL TO authenticated
  USING ((SELECT private.is_admin())) WITH CHECK ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "Admin can do all" ON public.skills;
DROP POLICY IF EXISTS "Admin can do all" ON public.skills;
CREATE POLICY "Admin can do all" ON public.skills FOR ALL TO authenticated
  USING ((SELECT private.is_admin())) WITH CHECK ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "Only admin can manage messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admin can manage messages" ON public.contact_messages;
CREATE POLICY "Only admin can manage messages" ON public.contact_messages FOR ALL TO authenticated
  USING ((SELECT private.is_admin())) WITH CHECK ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "Allow authenticated manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
CREATE POLICY "Admin manage categories" ON public.categories FOR ALL TO authenticated
  USING ((SELECT private.is_admin())) WITH CHECK ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "Allow authenticated manage issuers" ON public.issuers;
DROP POLICY IF EXISTS "Admin manage issuers" ON public.issuers;
CREATE POLICY "Admin manage issuers" ON public.issuers FOR ALL TO authenticated
  USING ((SELECT private.is_admin())) WITH CHECK ((SELECT private.is_admin()));

-- ---------------------------------------------------------------------------
-- 3. Keep projects.updated_at current
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Indexes for common filters / ordering
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_published_order
  ON projects (is_published, order_index);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills (order_index);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_at ON certificates (issued_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories (type);

-- ---------------------------------------------------------------------------
-- 5. Unique constraints so seeds' ON CONFLICT DO NOTHING actually works.
--    Removes exact duplicate rows first (keeps the oldest). Projects and
--    certificates store category/issuer as plain text, so no FK breaks.
-- ---------------------------------------------------------------------------
DELETE FROM categories c
USING categories d
WHERE c.name = d.name AND c.type = d.type
  AND (c.created_at, c.id) > (d.created_at, d.id);

DELETE FROM issuers i
USING issuers d
WHERE i.name = d.name
  AND (i.created_at, i.id) > (d.created_at, d.id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_categories_name_type ON categories (name, type);
CREATE UNIQUE INDEX IF NOT EXISTS uq_issuers_name ON issuers (name);

-- ---------------------------------------------------------------------------
-- 6. Make PostgREST (Data API) pick up the new tables/policies immediately
-- ---------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

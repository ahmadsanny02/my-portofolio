-- =============================================================================
-- 008: Admin-only RLS, updated_at trigger, indexes & unique constraints
--
-- BEFORE RUNNING:
--   1. Replace 'admin@example.com' below with your real admin e-mail(s).
--   2. Disable public sign-ups: Supabase Dashboard → Authentication →
--      Sign In / Providers → turn off "Allow new users to sign up".
--
-- The Express backend uses the service-role key (bypasses RLS). These policies
-- protect direct access with the public anon key exposed in the frontend.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Admin allowlist
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  email TEXT PRIMARY KEY
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY; -- no policies: invisible to anon/auth

INSERT INTO admin_users (email) VALUES ('admin@example.com')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Replace "any authenticated user" policies with admin-only policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin can do all" ON projects;
CREATE POLICY "Admin can do all" ON projects FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can do all" ON certificates;
CREATE POLICY "Admin can do all" ON certificates FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can do all" ON skills;
CREATE POLICY "Admin can do all" ON skills FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admin can manage messages" ON contact_messages;
CREATE POLICY "Only admin can manage messages" ON contact_messages FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated manage categories" ON categories;
CREATE POLICY "Admin manage categories" ON categories FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated manage issuers" ON issuers;
CREATE POLICY "Admin manage issuers" ON issuers FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- 3. Keep projects.updated_at current
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
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

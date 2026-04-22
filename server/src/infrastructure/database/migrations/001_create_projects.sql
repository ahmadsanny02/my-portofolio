CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(200) NOT NULL,
  slug        VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  thumbnail   TEXT,
  tech_stack  TEXT[] DEFAULT '{}',
  demo_url    TEXT,
  repo_url    TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published projects"
  ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "Admin can do all"
  ON projects FOR ALL USING (auth.role() = 'authenticated');

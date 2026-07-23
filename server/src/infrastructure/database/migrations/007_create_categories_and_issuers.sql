-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issuers table
CREATE TABLE IF NOT EXISTS issuers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies (allow read to public, manage to authenticated users)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE issuers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read issuers" ON issuers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage issuers" ON issuers FOR ALL USING (auth.role() = 'authenticated');

-- Seed initial categories
INSERT INTO categories (name, type) VALUES
  ('Web Application', 'project'),
  ('Mobile Application', 'project'),
  ('UI/UX Design', 'project'),
  ('Desktop Application', 'project'),
  ('Machine Learning / AI', 'project'),
  ('Frontend', 'skill'),
  ('Backend', 'skill'),
  ('Mobile', 'skill'),
  ('DevOps', 'skill'),
  ('Database', 'skill'),
  ('Tools', 'skill'),
  ('Web Development', 'certificate'),
  ('Cloud Computing', 'certificate'),
  ('Cyber Security', 'certificate'),
  ('Data Science', 'certificate'),
  ('Mobile Development', 'certificate')
ON CONFLICT DO NOTHING;

-- Seed initial issuers
INSERT INTO issuers (name) VALUES
  ('Coursera'),
  ('Udemy'),
  ('Dicoding'),
  ('Google'),
  ('Meta'),
  ('AWS'),
  ('FreeCodeCamp'),
  ('Hackerrank')
ON CONFLICT DO NOTHING;

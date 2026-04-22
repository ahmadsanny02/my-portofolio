CREATE TABLE skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  category    VARCHAR(100) NOT NULL,
  icon_url    TEXT,
  proficiency INT CHECK (proficiency BETWEEN 1 AND 100),
  order_index INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read skills"
  ON skills FOR SELECT USING (true);
CREATE POLICY "Admin can do all"
  ON skills FOR ALL USING (auth.role() = 'authenticated');

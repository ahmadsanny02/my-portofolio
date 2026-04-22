CREATE TABLE certificates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(200) NOT NULL,
  issuer      VARCHAR(200) NOT NULL,
  issued_at   DATE NOT NULL,
  expired_at  DATE,
  image_url   TEXT,
  credential_url TEXT,
  category    VARCHAR(100),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read certificates"
  ON certificates FOR SELECT USING (true);
CREATE POLICY "Admin can do all"
  ON certificates FOR ALL USING (auth.role() = 'authenticated');

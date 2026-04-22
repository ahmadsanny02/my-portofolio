CREATE TABLE contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(200) NOT NULL,
  email      VARCHAR(200) NOT NULL,
  subject    VARCHAR(300),
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admin can read/delete messages"
  ON contact_messages FOR SELECT, DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Public can insert messages"
  ON contact_messages FOR INSERT WITH CHECK (true);

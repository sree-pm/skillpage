-- Support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  created_by TEXT REFERENCES users(id),
  source TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'normal',
  assigned_to TEXT REFERENCES users(id),
  sla_due_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id TEXT REFERENCES users(id),
  is_internal INTEGER NOT NULL DEFAULT 0,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Review moderation fields
ALTER TABLE reviews ADD COLUMN moderation_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE reviews ADD COLUMN moderated_by TEXT REFERENCES users(id);
ALTER TABLE reviews ADD COLUMN moderated_at TEXT;
ALTER TABLE reviews ADD COLUMN rejection_reason TEXT;
ALTER TABLE reviews ADD COLUMN redaction_notes TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_reviews_moderation_status ON reviews(moderation_status);
